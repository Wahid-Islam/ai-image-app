import ImageUploader from '@/components/ImageUploader';

export default function Home() {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-3xl font-bold mb-6">AI Image Classifier</h1>
      <ImageUploader />
    </div>
  );
}
