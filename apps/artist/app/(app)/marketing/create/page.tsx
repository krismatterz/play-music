"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { ArrowLeft, Plus, Trash, Music, Calendar } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schema with validation
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist name is required"),
  releaseDate: z.string().min(1, "Release date is required"),
  backgroundColor: z.string(),
  // We'll validate links separately since it's a dynamic array
});

// Background options for the landing page
const backgroundOptions = [
  { label: "Amber", value: "from-amber-900 to-black" },
  { label: "Blue", value: "from-blue-900 to-black" },
  { label: "Purple", value: "from-purple-900 to-black" },
  { label: "Green", value: "from-green-900 to-black" },
  { label: "Red", value: "from-red-900 to-black" },
];

// Streaming platforms with their colors
const platforms = [
  { name: "Spotify", color: "#1DB954", action: "Pre-save" },
  { name: "Apple Music", color: "#FA243C", action: "Pre-add" },
  { name: "YouTube Music", color: "#FF0000", action: "Pre-save" },
  { name: "Amazon Music", color: "#00A8E1", action: "Pre-save" },
  { name: "Deezer", color: "#00C7F2", action: "Pre-save" },
  { name: "SoundCloud", color: "#FF7700", action: "Follow" },
  { name: "Tidal", color: "#000000", action: "Pre-save" },
];

export default function CreateLandingPage() {
  const [links, setLinks] = useState([
    { platform: "Spotify", url: "", color: "#1DB954", action: "Pre-save" },
    { platform: "Apple Music", url: "", color: "#FA243C", action: "Pre-add" },
  ]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: "",
      releaseDate: new Date().toISOString().split("T")[0],
      backgroundColor: "from-amber-900 to-black",
    },
  });

  // Handler for submitting the form
  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, you would save this to a database
    console.log({
      ...values,
      links,
      cover: coverPreview,
    });

    // Redirect to the marketing page or preview the landing page
    // router.push('/marketing');
  }

  // Handler for adding a new streaming platform link
  const addLink = () => {
    // Find a platform not already in the list
    const availablePlatforms = platforms.filter(
      (p) => !links.some((l) => l.platform === p.name),
    );

    if (availablePlatforms.length > 0) {
      const platform = availablePlatforms[0];
      setLinks([
        ...links,
        {
          platform: platform.name,
          url: "",
          color: platform.color,
          action: platform.action,
        },
      ]);
    }
  };

  // Handler for removing a streaming platform link
  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // Handler for updating a streaming platform link
  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links];
    // @ts-expect-error - Dynamic field access
    newLinks[index][field] = value;

    // If platform changed, update color and action
    if (field === "platform") {
      const platform = platforms.find((p) => p.name === value);
      if (platform) {
        // @ts-expect-error - Dynamic field access
        newLinks[index].color = platform.color;
        // @ts-expect-error - Dynamic field access
        newLinks[index].action = platform.action;
      }
    }

    setLinks(newLinks);
  };

  // Handler for file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/marketing">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketing
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Create Landing Page</h1>
          <div></div> {/* Empty div for flex alignment */}
        </div>

        <div className="mx-auto max-w-4xl rounded-lg border border-white/10 bg-black/40 p-6 shadow-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left column - Basic details */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Song or Album Title"
                            className="border-white/20 bg-black/50 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your artist name"
                            className="border-white/20 bg-black/50 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Date</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-amber-500" />
                            <Input
                              type="date"
                              className="border-white/20 bg-black/50 text-white"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="backgroundColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Style</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-white/20 bg-black/50 text-white">
                              <SelectValue placeholder="Select a background style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {backgroundOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Cover Art</FormLabel>
                    <div className="mt-2 flex flex-col items-center gap-4">
                      <div
                        className={`relative h-48 w-48 rounded-lg border-2 border-dashed border-white/30 ${coverPreview ? "" : "flex items-center justify-center bg-black/30"}`}
                      >
                        {coverPreview ? (
                          <Image
                            src={coverPreview}
                            alt="Cover preview"
                            fill
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <Music className="h-12 w-12 text-white/30" />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("cover-upload")?.click()
                        }
                        className="w-full border-white/20 bg-black/50"
                      >
                        Upload Cover
                      </Button>
                      <input
                        type="file"
                        id="cover-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Right column - Streaming links */}
                <div className="space-y-6">
                  <div>
                    <FormLabel className="mb-4 block">
                      Streaming Links
                    </FormLabel>
                    <div className="space-y-3">
                      {links.map((link, index) => (
                        <div
                          key={index}
                          className="rounded-md border border-white/10 bg-black/30 p-4"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <Select
                              value={link.platform}
                              onValueChange={(value) =>
                                updateLink(index, "platform", value)
                              }
                            >
                              <SelectTrigger className="w-full border-white/20 bg-black/50 text-white">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                {platforms.map((platform) => (
                                  <SelectItem
                                    key={platform.name}
                                    value={platform.name}
                                  >
                                    {platform.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLink(index)}
                              className="h-8 w-8 text-white/60 hover:text-white"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Link URL"
                            value={link.url}
                            onChange={(e) =>
                              updateLink(index, "url", e.target.value)
                            }
                            className="mt-2 border-white/20 bg-black/50 text-white"
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addLink}
                      className="mt-4 w-full border-white/20 bg-black/20"
                      disabled={links.length >= platforms.length}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Platform
                    </Button>
                  </div>

                  {/* Preview of selected background */}
                  <div>
                    <FormLabel>Background Preview</FormLabel>
                    <div
                      className={`mt-2 h-32 rounded-lg bg-gradient-to-b ${form.watch("backgroundColor")}`}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  className="font-medium text-black hover:bg-white/80"
                  type="button"
                  variant="outline"
                  asChild
                >
                  <Link href="/marketing">Cancel</Link>
                </Button>
                <Button
                  type="button"
                  disabled
                  className="bg-gradient-to-r from-amber-600 to-amber-400 font-medium text-white"
                  title="Coming soon"
                >
                  Coming Soon
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
