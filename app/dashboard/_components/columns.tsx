"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileCard } from "./file-card";
import { FileCardActions } from "./file-actions";
// Uncomment and ensure this import path is correct if you need the FileCardActions component
// import { FileCardActions } from "./file-actions";

function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, { userId });
  return (
    <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
      <Avatar className="w-6 h-6">
        {userProfile?.image ? (
          <AvatarImage src={userProfile.image} />
        ) : (
          <AvatarFallback>CN</AvatarFallback>
        )}
      </Avatar>
      {userProfile?.name || "Unknown User"}
    </div>
  );
}

export const columns: ColumnDef<
  Doc<"files"> & { url: string; isFavorited: boolean }
>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "User",
    cell: ({ row }) => {
      const userId = row.original.userId;
      return userId ? <UserCell userId={userId} /> : "Unknown User";
    },
  },
  {
    header: "Uploaded On",
    cell: ({ row }) => (
      <div>
        {formatRelative(new Date(row.original._creationTime), new Date())}
      </div>
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <div>
        <FileCardActions
          isFavorited={row.original.isFavorited}
          file={row.original}
        />
      </div>
    ),
  },
];
