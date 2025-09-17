"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Bell, Calendar, User, Loader2 } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AddFamilyMember from "./add-member";
import { FamilyMember, Notification, getFamilyMembers, getNotifications } from "../api/health-scheduler";

export default function FamilyVault() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddMember, setShowAddMember] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch family members and notifications from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API first
        const members = await getFamilyMembers();
        const notifs = await getNotifications();
        
        // If API is not available, use sample data
        if (members.length === 0) {
          setFamilyMembers([
            {
              id: "1",
              name: "Sarah Doe",
              relation: "child",
              dob: "2019-05-12",
              gender: "female",
              bloodGroup: "A+",
              allergies: "Peanuts",
              conditions: "Asthma",
              upcomingEvents: [{ title: "MMR Vaccine", date: "2024-06-15" }]
            },
            {
              id: "2",
              name: "Robert Doe",
              relation: "parent",
              dob: "1959-03-22",
              gender: "male",
              bloodGroup: "O+",
              allergies: "Penicillin",
              conditions: "Hypertension, Diabetes",
              upcomingEvents: [{ title: "Annual Checkup", date: "2024-07-10" }]
            }
          ]);
        } else {
          setFamilyMembers(members);
        }
        
        setNotifications(notifs);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. The backend server might not be running.');
        // Set sample data as fallback
        setFamilyMembers([
          {
            id: "1",
            name: "Sarah Doe",
            relation: "child",
            dob: "2019-05-12",
            gender: "female",
            bloodGroup: "A+",
            allergies: "Peanuts",
            conditions: "Asthma",
            upcomingEvents: [{ title: "MMR Vaccine", date: "2024-06-15" }]
          },
          {
            id: "2",
            name: "Robert Doe",
            relation: "parent",
            dob: "1959-03-22",
            gender: "male",
            bloodGroup: "O+",
            allergies: "Penicillin",
            conditions: "Hypertension, Diabetes",
            upcomingEvents: [{ title: "Annual Checkup", date: "2024-07-10" }]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddMember = (member: FamilyMember) => {
    setFamilyMembers(prev => [...prev, member]);
  };
  
  const getRelationLabel = (relation: string) => {
    const labels: Record<string, string> = {
      spouse: "Spouse",
      child: "Child",
      parent: "Father",
      sibling: "Sibling",
      other: "Family Member"
    };
    return labels[relation] || "Family Member";
  };
  
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Family Vault</h1>
          <p className="text-muted-foreground mb-8">
            Manage your family's health information in one secure place. Add family members, track health records, and receive timely notifications for important health events.
          </p>

          <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-8">
              <TabsTrigger value="profile">
                <User className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">Your Profile</span>
              </TabsTrigger>
              <TabsTrigger value="family">
                <Users className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">Family Members</span>
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">Notifications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal health information and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select 
                        id="gender" 
                        className="flex h-9 md:h-10 w-full rounded-md border border-input bg-background px-2 md:px-3 py-1 md:py-2 text-sm md:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blood">Blood Group</Label>
                      <select 
                        id="blood" 
                        className="flex h-9 md:h-10 w-full rounded-md border border-input bg-background px-2 md:px-3 py-1 md:py-2 text-sm md:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input id="allergies" placeholder="List any allergies (separated by commas)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conditions">Medical Conditions</Label>
                    <Input id="conditions" placeholder="List any medical conditions (separated by commas)" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="family" className="space-y-4">
              {showAddMember ? (
                <AddFamilyMember 
                  onClose={() => setShowAddMember(false)} 
                  onAdd={handleAddMember} 
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Family Members</CardTitle>
                    <CardDescription>
                      Add and manage your family members' health information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-center sm:justify-end">
                        <Button onClick={() => setShowAddMember(true)} className="w-full sm:w-auto">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Family Member
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {familyMembers.map(member => (
                          <Card key={member.id}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base md:text-lg">{member.name}</CardTitle>
                              <CardDescription className="text-xs md:text-sm">
                                {getRelationLabel(member.relation)} • {calculateAge(member.dob)} years old
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="text-xs md:text-sm">
                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-muted-foreground">Blood Group:</span> {member.bloodGroup || "Not specified"}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">DOB:</span> {new Date(member.dob).toLocaleDateString()}
                                  </div>
                                </div>
                                {member.upcomingEvents && member.upcomingEvents.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-muted-foreground">Upcoming:</span> 
                                    <span className="text-primary font-medium">
                                      {member.upcomingEvents[0].title} ({new Date(member.upcomingEvents[0].date).toLocaleDateString()})
                                    </span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="flex flex-col xs:flex-row justify-between gap-2 pt-2">
                              <Button variant="outline" size="sm" className="w-full xs:w-auto">Edit</Button>
                              <Button variant="outline" size="sm" className="w-full xs:w-auto">View Records</Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Health Notifications</CardTitle>
                  <CardDescription>
                    Manage your health reminders and notification preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="vaccine" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                      <Label htmlFor="vaccine">Vaccination Reminders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="checkup" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                      <Label htmlFor="checkup">Regular Checkup Reminders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="medication" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                      <Label htmlFor="medication">Medication Reminders</Label>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-lg font-medium mb-2">Upcoming Notifications</h3>
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : notifications.length > 0 ? (
                        <div className="space-y-2">
                          {notifications.map(notification => (
                            <div key={notification.id} className="flex items-center p-3 border rounded-md bg-muted/50">
                              <Calendar className="h-5 w-5 mr-3 text-primary" />
                              <div>
                                <p className="font-medium">{notification.memberName}'s {notification.eventTitle}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(notification.eventDate).toLocaleDateString()} 
                                  (in {notification.daysUntil} {notification.daysUntil === 1 ? 'day' : 'days'})
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Fallback notifications if API is not available */}
                          {familyMembers.flatMap(member => 
                            member.upcomingEvents?.map((event, index) => {
                              const eventDate = new Date(event.date);
                              const today = new Date();
                              const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                              
                              return (
                                <div key={`${member.id}-${index}`} className="flex items-center p-3 border rounded-md bg-muted/50">
                                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                                  <div>
                                    <p className="font-medium">{member.name}'s {event.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(event.date).toLocaleDateString()} 
                                      (in {daysUntil} {daysUntil === 1 ? 'day' : 'days'})
                                    </p>
                                  </div>
                                </div>
                              );
                            }) || []
                          )}
                          <div className="flex items-center p-3 border rounded-md bg-muted/50">
                            <Calendar className="h-5 w-5 mr-3 text-primary" />
                            <div>
                              <p className="font-medium">Your Dental Appointment</p>
                              <p className="text-sm text-muted-foreground">August 5, 2024 (in 2 months)</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}