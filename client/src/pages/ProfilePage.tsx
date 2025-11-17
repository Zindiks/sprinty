import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("");
  const [userData, setUserData] = useState<{
    id: string;
    login: string;
    avatar_url: string;
  } | null>(null);

  // Fetch the current user from OAuth
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/v1/oauth/user", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setUserId(data.id);
        } else {
          // User not authenticated, redirect to login
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/");
      }
    };
    fetchUser();
  }, [navigate]);

  const { GetProfile } = useProfile(userId);

  if (!userId) {
    return (
      <div className="container mx-auto p-6">
        <ProfilePage.Skeleton />
      </div>
    );
  }

  if (GetProfile.isLoading) {
    return (
      <div className="container mx-auto p-6">
        <ProfilePage.Skeleton />
      </div>
    );
  }

  if (GetProfile.isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profile = GetProfile.data;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        {profile && <EditProfileModal user_id={userId} currentProfile={profile} />}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={profile?.avatar_url || userData?.avatar_url}
                alt={profile?.username || userData?.login}
              />
              <AvatarFallback>
                {(profile?.username || userData?.login || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {profile?.username || userData?.login || "No username"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Member since {profile ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!profile && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                No profile found. Click "Edit Profile" to create your profile.
              </p>
            </div>
          )}

          {profile && (
            <>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base">{profile.email || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bio</p>
                    <p className="text-base">{profile.description || "No bio provided"}</p>
                  </div>
                </div>

                {profile.date_of_birth && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p className="text-base">
                        {new Date(profile.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Profile ID</p>
                    <p className="font-mono text-xs">{profile.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="text-xs">
                      {new Date(profile.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

ProfilePage.Skeleton = function ProfilePageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
