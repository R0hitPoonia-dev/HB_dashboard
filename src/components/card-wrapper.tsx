import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface cardProps {
  children: React.ReactNode;
  headerlabel: string;
  discription: string;
  backbuttonlabel: string;
  backbuttonhref: string;
  showsocial: boolean;
}

export const CardWrapper = ({
  children,
  headerlabel,
  discription,
  backbuttonhref,
  backbuttonlabel,
  showsocial,
}: cardProps) => {
  return (
    <Card className="max-w-sm w-full bg-pale text-brown font-semibold flex flex-col justify-center items-center">
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-3xl">{headerlabel}</CardTitle>
        <CardDescription>{discription}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">{children}</CardContent>
      <CardFooter className="flex flex-col">
        <Link to={backbuttonhref}>{backbuttonlabel}</Link>
        {showsocial && (
          <div className="h-10 w-full gap-2 flex items-center justify-end">
            <Button className="w-full bg-lbrown">Google</Button>
            <Button className="w-full bg-lbrown">Facebook</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
