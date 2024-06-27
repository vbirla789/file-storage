import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrashIcon,
  MoreVertical,
  GanttChartIcon,
  ImageIcon,
  FileTextIcon,
  StarIcon,
  StarHalf,
  UndoIcon,
  FileIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";
import { formatRelative } from "date-fns";

function FileCardActions({
  file,
  isFavorited,
}: {
  file: Doc<"files">;
  isFavorited: boolean;
}) {
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);

  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for deletion process. Files are
              deleted periodically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({ fileId: file._id });
                toast({
                  title: "File marked for deletion",
                  description: "Your file will be deleted shortly.",
                  variant: "default",
                });
                setIsConfirmOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => {
              toggleFavorite({ fileId: file._id });
            }}
          >
            {isFavorited ? (
              <div className="flex gap-1 items-center">
                <StarIcon className="w-4 h-4" />
                Unfavorite
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <StarHalf className="w-4 h-4" />
                Favorite
              </div>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => {
              window.open(getFileUrl(file.fileId), "_blank");
            }}
          >
            <div className="flex gap-1 items-center">
              <FileIcon className="w-4 h-4" />
              Download
            </div>
          </DropdownMenuItem>

          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-1 items-center cursor-pointer"
              onClick={() => {
                if (file.shouldDelete) {
                  restoreFile({ fileId: file._id });
                  toast({
                    title: "File restored",
                    description: "Your file is now restored.",
                    variant: "default",
                  });
                } else {
                  setIsConfirmOpen(true);
                }
              }}
            >
              {file.shouldDelete ? (
                <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                  <UndoIcon className="w-4 h-4" /> Restore
                </div>
              ) : (
                <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                  <TrashIcon className="w-4 h-4" /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function getFileUrl(fileId: Id<"_storage">): string {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export function FileCard({
  file,
  favorites = [],
}: {
  file: Doc<"files">;
  favorites?: Doc<"favorites">[];
}) {
  const userProfile = file.userId
    ? useQuery(api.users.getUserProfile, {
        userId: file.userId,
      })
    : undefined;

  const typeIcons: Record<Doc<"files">["type"], ReactNode> = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  };

  const isFavorited = favorites.some(
    (favorite) => favorite.fileId === file._id
  );

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
          <FileCardActions isFavorited={isFavorited} file={file} />
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
