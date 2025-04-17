export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Artists</h1>
      </div>
    </div>
  );
}
