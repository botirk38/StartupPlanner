import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, TrendingDown, Minus, RefreshCw, Plus } from 'lucide-react';
import { useBusinessContext } from '@/context/business-context';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Trash } from 'lucide-react';
import { SiCanva } from 'react-icons/si';


type Strength = {
  description: string;
};

type Weakness = {
  description: string;
};

type Competitor = {
  id: string;
  business: number;
  name: string;
  industry: string;
  product: string;
  market_share: string;
  strengths: Strength[];
  weaknesses: Weakness[];
  website: string;
  customer_reviews: number;
  growth_trend: 'Steady' | 'Increasing' | 'Decreasing';
};

const CompetitorResearch: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedBusiness, setSelectedBusiness } = useBusinessContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getCompetitors(page);
  };



  useEffect(() => {
    getCompetitors();
    toast({
      title: "Fetching competitors success.",
      description: 'Crush the competition!'
    });

  }, [])


  const generateCompetitors = async () => {
    try {
      setIsGenerating(true);

      if (!selectedBusiness) {
        throw new Error("No business selected");
      }

      const response = await fetch("/api/competitors/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedBusiness)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate competitors");
      }

      const newCompetitors = await response.json();
      console.log("New competitors: ", newCompetitors);

      setCompetitors(prevCompetitors => {
        const updatedCompetitors = [...prevCompetitors];
        newCompetitors.forEach((newCompetitor: Competitor) => {
          const index = updatedCompetitors.findIndex(c => c.id === newCompetitor.id);
          if (index !== -1) {
            updatedCompetitors[index] = newCompetitor;
          } else {
            updatedCompetitors.push(newCompetitor);
          }
        });
        return updatedCompetitors;
      });

      toast({
        title: "Competitors generated successfully",
        description: 'New competitors added. Crush the competition!'
      });
    } catch (error: any) {
      console.error("Error generating competitors:", error);
      toast({
        title: "Error generating competitors",
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteCompetitors = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/competitors/?businessId=${selectedBusiness?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Deleting competitors failed.",
          description: `${errorData.message}`
        });
        return;
      }

      // Clear the competitors list
      setCompetitors([]);
      setSelectedCompetitor(null);

      toast({
        title: "Competitors deleted successfully.",
        description: "All competitors have been removed."
      });
    } catch (error: any) {
      console.log("Error: ", error);
      toast({
        title: "Error deleting competitors",
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const deleteCompetitor = async (competitorId: string) => {
    try {

      const response = await fetch(`/api/competitors/${competitorId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Deleting competitors failed.",
          description: `${errorData.message}`
        });
        return;


      }

      setCompetitors(competitors.filter(competitor => competitor.id != competitorId));

      // If you have a selected competitor state, update it
      if (selectedCompetitor && selectedCompetitor.id === competitorId) {
        setSelectedCompetitor(null);
      }



    } catch (error: any) {

      console.log("Error: ", error);
      toast({
        title: "Error deleting competitor",
        description: error.message || "An unexpected error occurred"
      });


    }

  }

  const getCompetitors = async (page = 1) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/competitors?page=${page}&businessId=${selectedBusiness?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Fetching competitors failed.",
          description: `${errorData.message}`
        });
        return;
      }

      const data = await response.json();
      console.log("Data: ", data);
      setCompetitors(data.results);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.count / 3)); // Assuming 3 items per page
      setNextPage(data.next);
      setPreviousPage(data.previous);


    } catch (err: any) {
      console.log("Error: ", err);
      throw new Error("Error: ", err);
    } finally {
      setIsLoading(false);
    }
  }

  const regenerateCompetitors = () => {
    setSelectedCompetitor(null);
    generateCompetitors();
  };

  const renderCompetitorDetails = (competitor: Competitor) => (
    <Card className="w-full dark:bg-gray-800">
      <CardHeader>
        <CardTitle className='dark:text-white'>{competitor.name}</CardTitle>
        <p className="text-muted-foreground dark:text-gray-400">{competitor.product}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 dark:bg-gray-700 dark:text-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 dark:text-gray-400">Market Share</h4>
              <Progress value={parseFloat(competitor.market_share)} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1 dark:text-white">{competitor.market_share}%</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 dark:text-gray-400">Customer Reviews</h4>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(competitor.customer_reviews / 50) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">{competitor.customer_reviews}</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 dark:text-gray-400">Growth Trend</h4>
              <Badge variant="outline" className="flex items-center gap-1 dark:bg-white">
                {competitor.growth_trend === 'Increasing' && <TrendingUp className="w-4 h-4 text-green-500" />}
                {competitor.growth_trend === 'Decreasing' && <TrendingDown className="w-4 h-4 text-red-500" />}
                {competitor.growth_trend === 'Steady' && <Minus className="w-4 h-4 text-blue-500" />}
                {competitor.growth_trend}
              </Badge>
            </div>
          </TabsContent>
          <TabsContent value="strengths">
            <ul className="list-disc pl-5 space-y-1">
              {competitor.strengths.map((strength, index) => (
                <li key={index} className='dark:text-green-500'>{strength.description}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="weaknesses">
            <ul className="list-disc pl-5 space-y-1">
              {competitor.weaknesses.map((weakness, index) => (
                <li key={index} className='dark:text-red-500'>{weakness.description}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
        <div>
          <h4 className="font-semibold mb-2 dark:text-gray-400">Website</h4>
          <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {competitor.website}
          </a>
        </div>
      </CardContent>
    </Card>
  );


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  return (
    <div className="min-h-screen w-full flex-col bg-muted/40 p-4 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">Competitor Research</h1>
      {competitors.length === 0 ? (
        <Card className="w-full bg-gray-800 text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">No competitors generated yet</h2>
            <p className="text-muted-foreground dark:text-gray-400 mb-6">
              Click the button below to generate a list of potential competitors.
            </p>
            <Button
              size="lg"
              onClick={generateCompetitors}
              disabled={isGenerating}
              className='dark:bg-gray-700'
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Competitors'
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-end mb-4 gap-2">
            <Button
              size="sm"
              onClick={regenerateCompetitors}
              disabled={isGenerating}
              className='dark:bg-gray-700'
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Finding new Competitor...
                </>
              ) : (
                <>
                  <Plus className='mr-2 h-4 w-4' />
                  Find new Competitors
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={deleteCompetitors}
              disabled={isDeleting}
              className='bg-red-500 text-white'
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className='mr-2 h-4 w-4' />
                  Delete Competitors
                </>
              )}
            </Button>


            <Button

              size="sm"
              onClick={() => setIsExporting(true)}
              disabled={isExporting}
              className='bg-[#00C4CC] hover:bg-[#00A4AC] text-white font-bold gap-2  '

            >

              <SiCanva className="h-5 w-5" />

              Export to Canva

            </Button>




          </div>
          <BentoGrid className="mb-8">
            {competitors.map((competitor, index) => {
              const displayIndex = (currentPage - 1) * 3 + index + 1; // Adjust for pagination
              return (
                <BentoGridItem
                  key={competitor.id}
                  title={competitor.name}
                  description={
                    <div className='space-y-8'>
                      <p>{competitor.product}</p>
                      <Button size="sm" className='dark:bg-gray-900' onClick={() => setSelectedCompetitor(competitor)}>View Details</Button>
                    </div>
                  }
                  className={selectedCompetitor === competitor ? "ring-2 ring-primary dark:bg-gray-800" : "dark:bg-gray-800"}
                  icon={
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground dark:bg-gray-900">
                      {displayIndex}
                    </div>
                  }
                  header={
                    <div className="flex justify-between items-center">
                      <Badge className='dark:bg-gray-900'>{competitor.industry}</Badge>

                      <Button variant={"ghost"} className='hover:bg-transparent' onClick={() => deleteCompetitor(competitor.id)}>
                        <Trash className='w-4 h-4 mr-2 text-red-500' />
                      </Button>
                    </div>
                  }
                />
              );
            })}
          </BentoGrid>

          <div className='py-6'>
            {selectedCompetitor && renderCompetitorDetails(selectedCompetitor)}
          </div>
          <div className="flex justify-center">
            <Button size="lg" className='dark:bg-gray-800'>Find gaps in the market</Button>
          </div>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (previousPage) handlePageChange(currentPage - 1);
                  }}
                  className={`dark:text-white ${!previousPage && 'pointer-events-none opacity-50'}`}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(index + 1);
                    }}
                    className={`dark:text-white ${currentPage === index + 1 ? 'dark:bg-blue-500 dark:active:bg-white' : 'dark:bg-gray-700'}`}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (nextPage) handlePageChange(currentPage + 1);
                  }}
                  className={`dark:text-white ${!nextPage && 'pointer-events-none opacity-50'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}

export default CompetitorResearch;

