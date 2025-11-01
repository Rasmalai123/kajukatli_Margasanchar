"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bell, Send } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const alertSchema = z.object({
  route: z.string().min(1, { message: "Route is required." }).max(10, {message: "Route ID too long."}),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(160, {message: "Message cannot exceed 160 characters."}),
});

export default function BroadcastAlert() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof alertSchema>>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      route: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof alertSchema>) {
    // Here you would typically call a server action or API to send the alert.
    console.log("Broadcasting alert:", values);
    toast({
      title: "Alert Broadcasted!",
      description: `Message sent to users on route ${values.route}.`,
    });
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Broadcast Alert</CardTitle>
        <CardDescription>
          Send real-time alerts to passengers on specific routes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A1, B2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Heavy traffic expected near City Center. Expect delays."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              <Send className="mr-2 h-4 w-4" /> Broadcast Alert
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
