import Link from "next/link"
import { getBoards } from "@/lib/actions/board/get-boards"

import { Skeleton } from "@/components/ui/skeleton"
import { FormPopover } from "@/components/form-items/form-popover"
import { LandPlot } from "lucide-react"

export const BoardList = async () => {
  const boards = await getBoards()
  // console.log({boards})

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-gray-700">
        <LandPlot className="h-6 w-6 mr-2" />
        Your trips
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormPopover
          sideOffset={10}
          className="centered-popover"
        >
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new trip</p>
          </div>
        </FormPopover>
        {boards && boards.map((board) => (
          <Link
            key={board._id}
            href={`/board/${board._id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-teal-700 rounded-sm h-full w-full p-2 overflow-hidden"
            style={{ backgroundImage: board.imageUrl ? `url(${board.imageUrl})` : "none" }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">
              {board.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  )
}