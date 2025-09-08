import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CarouselSize } from "./carousel";
import { AlertDialogDemo } from "../_comps/matud";
import ProtectedRoute from "./pr";
export default async function Page() {
  return (
    <ProtectedRoute>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "350px",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 dark:*:">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              {/* <InputFile /> */}
              <AlertDialogDemo />
            </Breadcrumb>
          </header>
          <div className="flex flex-1 items-center justify-center">
            <CarouselSize />
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className=" aspect-video h-12 w-full rounded-lg bg-muted/50"
              />
            ))}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
