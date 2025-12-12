import LoadingThreeDotsJumping from "@/app/components/animations/jumpingDots.animations";
import clsx from "clsx";

export default function Loading() {
  return (
    <div className={clsx("flex fixed h-full w-full bg-gray-400/50 backdrop-blur-sm left-0 top-0 transition-all")}>
      <LoadingThreeDotsJumping />
    </div>
  );
}
