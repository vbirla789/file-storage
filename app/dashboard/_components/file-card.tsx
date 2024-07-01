import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GanttChartIcon, ImageIcon, FileTextIcon } from "lucide-react";
import { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { formatRelative } from "date-fns";
import {
  FileCardActions,
  getFileUrl,
} from "@/app/dashboard/_components/file-actions";

function isUserId(
  value: string | Id<"users"> | undefined
): value is Id<"users"> {
  return typeof value === "object" && value !== null && "__tableName" in value;
}

export function FileCard({
  file,
}: {
  file: Doc<"files"> & { isFavorited: boolean };
}) {
  // Call useQuery only if file.userId is of type Id<"users">
  const userProfile = isUserId(file.userId)
    ? useQuery(api.users.getUserProfile, {
        userId: file.userId,
      })
    : undefined;

  const typeIcons: Record<Doc<"files">["type"], ReactNode> = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  };

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 items-center text-base font-normal">
          <div className="flex justify-center items-center">
            {typeIcons[file.type]}
          </div>
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardActions isFavorited={file.isFavorited} file={file} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type === "image" && (
          <Image
            alt={file.name}
            src={getFileUrl(file.fileId)}
            width={200}
            height={100}
          />
        )}
        {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
        {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-gray-700">
          Uploaded {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
}
