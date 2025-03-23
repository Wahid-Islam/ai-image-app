import ImageUploader from '@/components/ImageUploader';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">
        📸 AI-Powered Image Classifier
      </h1>
      <ImageUploader />
    </main>
  );
}
