"use client";
import React from "react";
import { createClient } from "../utils/supabase/client";
import { useState, useEffect } from "react";
import { UUID } from "crypto";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Topdetail() {
  interface Document {
    id: UUID;
    file_name: string;
    mime_type: string;
    size: string;
  }

  const [docer, setDocer] = useState<Document[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function fetchDetail() {
      const { data, error } = await supabase
        .from("documents") // 👈 replace with your actual table name
        .select("id, file_name, mime_type, size")
        .order("id", { ascending: false }) // latest first
        .limit(5);

      if (error) {
        console.log(error.message);
      } else {
        setDocer(data ?? []);
      }
    }
    fetchDetail();
  }, []);

  return (
    <div>
      <Carousel
        opts={{ align: "start" }}
        className="w-[400px] md:w-[600px] lg:w-[800px]"
      >
        <CarouselContent>
          {docer.map((doc) => (
            <CarouselItem key={doc.id} className="md:basis-1/3 lg:basis-1/3">
              <div className="p-4">
                <Card>
                  <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                    <span className="text-lg font-semibold">
                      {doc.file_name}
                    </span>
                    <span className="text-sm text-muted-foreground mt-2">
                      {doc.mime_type}
                    </span>
                    <span className="text-xs text-gray-500 mt-2">
                      {Math.round(Number(doc.size) / 1024)} KB
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
