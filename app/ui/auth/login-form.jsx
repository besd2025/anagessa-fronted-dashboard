"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "../toggle-theme-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchData } from "@/app/_utils/api";
import { useRouter } from "next/navigation";
export function LoginForm({ className, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [identifiant, setIdentifiant] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const accessToken = localStorage.getItem("AccessToken");
    if (accessToken) {
      const user = DecodeToJwt(accessToken);
      const now = new Date();
      if (now < new Date(user?.exp * 1000)) {
        if (
          user?.category === "Admin" ||
          user?.category === "Anagessa" ||
          user?.category === "General"
        ) {
          console.log(user?.category);

          router.push("/anagessa-dashboard/home");
        }
      } else {
        localStorage.removeItem("AccessToken");
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  function DecodeToJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Échec du décodage du token", error);
      return null;
    }
  }

  const handleLogin = async (e) => {
    if (e) e.preventDefault(); // évite rechargement du formulaire

    if (!identifiant || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Signature-web": process.env.NEXT_PUBLIC_SIGNATURE,
          },
          body: JSON.stringify({ identifiant, password }),
        },
      );

      if (!response.ok) {
        setLoading(false);
        const errorData = await response.json();
        throw new Error(errorData?.detail || "Échec de connexion.");
      }
      setLoading(true);
      const data = await response.json();
      document.cookie = `AccessToken=${data.access}; path=/; max-age=3600; secure`;
      localStorage.setItem("AccessToken", data.access);
      const user = DecodeToJwt(data.access);
      if (
        user?.category === "Admin" ||
        user?.category === "Anagessa" ||
        user?.category === "General"
      ) {
        console.log(user?.category);

        router.push("/anagessa-dashboard/home");
      } else if (user?.category === "Communal") {
        router.push("/municipal/cultivators");
      } else if (user?.category === "Provincial") {
        router.push("/provincial/cultivators");
      } else if (user?.category === "Regional") {
        router.push("/regional/cultivators");
      } else {
        setError("Vous n'avez pas d'accès.");
      }
    } catch (err) {
      setError("Identifiants invalides. Veuillez réessayer.");
      console.error("Erreur de connexion :", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6 relative", className)} {...props}>
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/mais_background.jpg"
          alt="Background"
          fill
          className="object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      </div>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 relative">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Se connecter</h1>
                <p className="text-muted-foreground text-balance">
                  Connectez-vous à votre compte{" "}
                  <span className="font-bold text-primary text-lg">
                    ANAGESSA
                  </span>
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Identifiant</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  value={identifiant}
                  placeholder="email@example.com"
                  onChange={(e) => setIdentifiant(e.target.value)}
                />
              </Field>
              <Field>
                <div className="relative">
                  <div className="flex items-center mb-2">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 h-8 w-8 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </span>
                </div>
              </Field>
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Field>
                <Button type="submit" onClick={handleLogin} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Se connecter
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/images/mais_background.png"
              alt="Image"
              fill
              className="object-cover dark:brightness-[0.7]"
              loading="eager"
            />
          </div>
          <ModeToggle className="absolute top-4 right-4" />
        </CardContent>
      </Card>
    </div>
  );
}
