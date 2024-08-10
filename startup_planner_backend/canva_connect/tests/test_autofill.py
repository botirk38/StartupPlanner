from django.test import TestCase
from unittest.mock import patch, MagicMock
from canva_connect.endpoints.autofill import AutofillEndpoint, AutofillData, AutofillDataItem, AutofillOperationError


class TestAutofillEndpoint(TestCase):

    def setUp(self):
        self.endpoint = AutofillEndpoint(MagicMock())  # Mock the client
        self.autofill_data = AutofillData(
            brand_template_id="template123",
            title="Test Autofill",
            data={
                "field1": AutofillDataItem(type="text", text="Sample text"),
                "field2": AutofillDataItem(type="image", asset_id="asset123")
            }
        )

    # Mock sleep to speed up tests
    @patch('canva_connect.endpoints.autofill.time.sleep')
    def test_autofill_template_success(self, mock_sleep):
        with patch.object(self.endpoint, '_create_autofill_job') as mock_create_job, \
                patch.object(self.endpoint, 'get_autofill_job') as mock_get_job:

            mock_create_job.return_value = {
                'job': {'id': 'job123', 'status': 'in_progress'}}
            mock_get_job.side_effect = [
                {'job': {'id': 'job123', 'status': 'in_progress'}},
                {'job': {'id': 'job123', 'status': 'success', 'result': 'Success data'}}
            ]

            result = self.endpoint.autofill_template(self.autofill_data)

            self.assertEqual(result['job']['status'], 'success')
            self.assertEqual(result['job']['result'], 'Success data')
            mock_create_job.assert_called_once_with(self.autofill_data)
            self.assertEqual(mock_get_job.call_count, 2)

    @patch('canva_connect.endpoints.autofill.time.sleep')
    def test_autofill_template_failure(self, mock_sleep):
        with patch.object(self.endpoint, '_create_autofill_job') as mock_create_job, \
                patch.object(self.endpoint, 'get_autofill_job') as mock_get_job:

            mock_create_job.return_value = {
                'job': {'id': 'job123', 'status': 'in_progress'}}
            mock_get_job.return_value = {
                'job': {'id': 'job123', 'status': 'failed', 'error': {'message': 'Test error'}}}

            with self.assertRaises(AutofillOperationError) as context:
                self.endpoint.autofill_template(self.autofill_data)

            self.assertIn('Autofill job failed: Test error',
                          str(context.exception))

    @patch('canva_connect.endpoints.autofill.time.sleep')
    def test_autofill_template_timeout(self, mock_sleep):
        with patch.object(self.endpoint, '_create_autofill_job') as mock_create_job, \
                patch.object(self.endpoint, 'get_autofill_job') as mock_get_job:

            mock_create_job.return_value = {
                'job': {'id': 'job123', 'status': 'in_progress'}}
            mock_get_job.return_value = {
                'job': {'id': 'job123', 'status': 'in_progress'}}

            with self.assertRaises(AutofillOperationError) as context:
                self.endpoint.autofill_template(
                    self.autofill_data, max_retries=3)

            self.assertIn('Autofill job timed out after 3 attempts',
                          str(context.exception))
            self.assertEqual(mock_get_job.call_count, 3)

    def test_create_autofill_job(self):
        with patch.object(self.endpoint, '_make_request') as mock_request:
            mock_request.return_value = {
                'job': {'id': 'job123', 'status': 'created'}}

            result = self.endpoint._create_autofill_job(self.autofill_data)

            self.assertEqual(result['job']['id'], 'job123')
            mock_request.assert_called_once_with(
                "POST", endpoint=self.endpoint.BASE_ENDPOINT, data=self.autofill_data.dict())

    def test_get_autofill_job(self):
        with patch.object(self.endpoint, '_make_request') as mock_request:
            mock_request.return_value = {
                'job': {'id': 'job123', 'status': 'in_progress'}}

            result = self.endpoint.get_autofill_job('job123')

            self.assertEqual(result['job']['status'], 'in_progress')
            mock_request.assert_called_once_with(
                "GET", endpoint=f"{self.endpoint.BASE_ENDPOINT}/job123")

    def test_create_autofill_job_error(self):
        with patch.object(self.endpoint, '_make_request') as mock_request:
            mock_request.side_effect = Exception("API Error")

            with self.assertRaises(AutofillOperationError) as context:
                self.endpoint._create_autofill_job(self.autofill_data)

            self.assertIn('Autofill job creation failed: API Error',
                          str(context.exception))

    def test_get_autofill_job_error(self):
        with patch.object(self.endpoint, '_make_request') as mock_request:
            mock_request.side_effect = Exception("API Error")

            with self.assertRaises(AutofillOperationError) as context:
                self.endpoint.get_autofill_job('job123')

            self.assertIn(
                'Failed to get autofill job status: API Error', str(context.exception))
