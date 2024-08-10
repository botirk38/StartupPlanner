from django.test import TestCase
from unittest.mock import patch, MagicMock
from canva_connect.endpoints.folders import FoldersEndpoint, FolderOperationError


class TestFoldersEndpoint(TestCase):
    def setUp(self):
        self.endpoint = FoldersEndpoint(MagicMock())

    @patch.object(FoldersEndpoint, '_make_request')
    def test_create_folder(self, mock_make_request):
        # Arrange
        mock_make_request.return_value = {
            "id": "new_folder_id", "name": "New Folder"}

        # Act
        result = self.endpoint.create_folder("New Folder", "parent_id")

        # Assert
        mock_make_request.assert_called_once_with(
            "POST",
            "folders",
            data={"name": "New Folder", "parent_folder_id": "parent_id"}
        )
        self.assertEqual(result, {"id": "new_folder_id", "name": "New Folder"})

    @patch.object(FoldersEndpoint, '_make_request')
    def test_create_folder_without_parent(self, mock_make_request):
        # Arrange
        mock_make_request.return_value = {
            "id": "new_folder_id", "name": "New Folder"}

        # Act
        result = self.endpoint.create_folder("New Folder")

        # Assert
        mock_make_request.assert_called_once_with(
            "POST",
            "folders",
            data={"name": "New Folder"}
        )
        self.assertEqual(result, {"id": "new_folder_id", "name": "New Folder"})

    @patch.object(FoldersEndpoint, '_make_request')
    def test_update_folder(self, mock_make_request):
        # Arrange
        mock_make_request.return_value = {
            "id": "folder_id", "name": "Updated Folder"}

        # Act
        result = self.endpoint.update_folder("folder_id", "Updated Folder")

        # Assert
        mock_make_request.assert_called_once_with(
            "PATCH",
            "folders/folder_id",
            data={"name": "Updated Folder"}
        )
        self.assertEqual(result, {"id": "folder_id", "name": "Updated Folder"})

    @patch.object(FoldersEndpoint, '_make_request')
    def test_delete_folder(self, mock_make_request):
        # Arrange
        mock_make_request.return_value = {"status": "success"}

        # Act
        result = self.endpoint.delete_folder("folder_id")

        # Assert
        mock_make_request.assert_called_once_with(
            "DELETE", "folders/folder_id")
        self.assertEqual(result, {"status": "success"})

    @patch.object(FoldersEndpoint, '_make_request')
    def test_list_folder_items(self, mock_make_request):
        # Arrange
        mock_make_request.return_value = {
            "items": [{"id": "item1"}, {"id": "item2"}]}

        # Act
        result = self.endpoint.list_folder_items(
            "folder_id", continuation="token", item_types=["asset", "folder"])

        # Assert
        mock_make_request.assert_called_once_with(
            "GET",
            "folders/folder_id/items",
            params={"continuation": "token", "item_types": "asset,folder"}
        )
        self.assertEqual(result, {"items": [{"id": "item1"}, {"id": "item2"}]})

    @patch.object(FoldersEndpoint, '_make_request')
    def test_get_folder(self, mock_make_request):
        # Arrange
        mock_make_request.return_value = {
            "id": "folder_id", "name": "My Folder"}

        # Act
        result = self.endpoint.get_folder("folder_id")

        # Assert
        mock_make_request.assert_called_once_with("GET", "folders/folder_id")
        self.assertEqual(result, {"id": "folder_id", "name": "My Folder"})

    @patch.object(FoldersEndpoint, '_make_request')
    def test_folder_operation_error(self, mock_make_request):
        # Arrange
        mock_make_request.side_effect = Exception("API Error")

        # Act & Assert
        with self.assertRaises(FolderOperationError):
            self.endpoint.create_folder("New Folder")

