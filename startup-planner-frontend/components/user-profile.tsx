"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

function UserProfile() {
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:px-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-medium">Jared Palmer</div>
            <div className="text-xs text-muted-foreground">jared@acme.inc</div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="ml-auto">
          Edit Profile
        </Button>
      </header>
      <main className="flex-1">
        <Tabs defaultValue="account" className="w-full max-w-3xl mx-auto py-8">
          <TabsList className="border-b">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Update your personal information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Jared Palmer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="jared@acme.inc" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue="I'm a software engineer and designer. I love building products that solve real problems."
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="billing">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Update your payment method and billing details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" defaultValue="4111 1111 1111 1111" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Expiry Date</Label>
                    <Input id="card-expiry" defaultValue="12/24" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="card-cvc">CVC</Label>
                    <Input id="card-cvc" defaultValue="123" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-zip">Zip Code</Label>
                    <Input id="card-zip" defaultValue="90210" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Payment Method</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Update your password and two-factor authentication.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="2fa">Two-Factor Authentication</Label>
                  <ToggleGroup type="single" defaultValue="disabled">
                    <ToggleGroupItem value="disabled">Disabled</ToggleGroupItem>
                    <ToggleGroupItem value="enabled">Enabled</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Security Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default UserProfile;
