"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import Image from "next/image";
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UploadButton } from "@/app/dashboard/_components/upload-button";
import { api } from "@/convex/_generated/api";
import { FileCard } from "@/app/dashboard/_components/file-card";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">
        You have no files, go ahead and upload one now
      </div>
      <UploadButton />
    </div>
  );
}

export function FileBrowser({
  title,
  favorites,
}: {
  title: string;
  favorites?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites } : "skip"
  );
  const isLoading = files === undefined;

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-24 w-24 animate-spin text-gray-500" />
          <div>Loading your images</div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>

          {files.length === 0 && <Placeholder />}

          <div className="grid grid-cols-3 gap-4">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}
