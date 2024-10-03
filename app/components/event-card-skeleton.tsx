import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const EventCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-5 w-20" />
      </CardHeader>
      <CardContent>
        <h3 className="mb-2">
          <Skeleton className="h-6 w-28" />
        </h3>
        <ul className="flex gap-1 flex-wrap">
          {Array.from({ length: Math.floor(Math.random() * 6) + 2 }).map(
            (_, index) => (
              <Skeleton key={index} className="h-8 w-8 rounded-full" />
            )
          )}
        </ul>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );
};
