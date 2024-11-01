"use client";
import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  MessageCircle,
  Command,
  GalleryVerticalEnd,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Providers",
      url: "/providers",
      icon: BookOpen,
      items: [
        {
          title: "List",
          url: "/providers",
        },
        {
          title: "Add New",
          url: "/providers/create",
        },
      ],
    },
    {
      title: "Message",
      url: "/message",
      icon: MessageCircle,
      items: [
        {
          title: "List",
          url: "/message",
        },
        {
          title: "Add New",
          url: "/message/create",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  data.user.name = session?.user?.name || "admin";
  data.user.email = session?.user?.email || "test@gmail.com";

  const [mounted, setMounted] = React.useState(false);

  // Only render after first client-side mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading skeleton
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
