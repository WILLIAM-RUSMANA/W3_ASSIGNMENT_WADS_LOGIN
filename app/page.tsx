import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div>
      <h1>This is button component from shadcn/ ui</h1>
      <Button
        variant="outline"
        className= "bg-red-400">
          Button
        </Button>
    </div>
  );
}