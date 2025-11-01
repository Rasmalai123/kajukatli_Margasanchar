
"use client";

import { useState, useRef, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { destinations, getBusesByDestination } from "@/lib/data";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty." }),
});

type FormValues = z.infer<typeof formSchema>;

type Message = {
  id: number;
  text: string | React.ReactNode;
  sender: "user" | "bot";
};

type ConversationState =
  | "AWAITING_STATION_CODE"
  | "AWAITING_DESTINATION"
  | "COMPLETE";

export default function OfflineSmsPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome! Please enter the 3-digit station code to begin.", sender: "bot" },
  ]);
  const [isReplying, setIsReplying] = useState(false);
  const [conversationState, setConversationState] =
    useState<ConversationState>("AWAITING_STATION_CODE");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string | React.ReactNode, sender: "user" | "bot") => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), text, sender },
    ]);
  };

  const handleStationCode = (code: string) => {
    setIsReplying(true);
    setTimeout(() => {
      if (code.trim() === "124") {
        const destinationOptions = destinations.map(
          (dest, index) => `${index + 1} for ${dest.name}`
        ).join('\n');
        
        addMessage(
          <>
            <p>Great! Now, where are you going?</p>
            <p className="whitespace-pre-wrap mt-2">{destinationOptions}</p>
          </>,
          "bot"
        );
        setConversationState("AWAITING_DESTINATION");
      } else {
        addMessage("Invalid station code. Please enter the correct 3-digit code (124).", "bot");
      }
      setIsReplying(false);
    }, 1000);
  };

  const handleDestination = (choice: string) => {
    setIsReplying(true);
    setTimeout(() => {
        const choiceNum = parseInt(choice.trim(), 10);
        const selectedDestination = destinations[choiceNum - 1];

        if (selectedDestination) {
            const buses = getBusesByDestination(selectedDestination.name);
            if (buses.length > 0) {
                const busInfo = buses.map(bus => `Bus ${bus.number}: ${bus.eta}`).join('\n');
                addMessage(
                  <>
                    <p>Buses to {selectedDestination.name}:</p>
                    <p className="whitespace-pre-wrap mt-2">{busInfo}</p>
                    <p className="mt-4 text-xs">Enter station code '124' to start a new query.</p>
                  </>,
                  "bot"
                );
            } else {
                addMessage(`No buses found for ${selectedDestination.name}.`, "bot");
            }
            setConversationState("AWAITING_STATION_CODE");
        } else {
            addMessage("Invalid choice. Please send a number from the list.", "bot");
        }
        setIsReplying(false);
    }, 1500);
  };


  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addMessage(data.message, "user");
    form.reset();

    if (conversationState === "AWAITING_STATION_CODE") {
      handleStationCode(data.message);
    } else if (conversationState === "AWAITING_DESTINATION") {
      handleDestination(data.message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Offline Query via SMS" />
      <div ref={scrollAreaRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-end gap-2",
              msg.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-xs rounded-2xl px-4 py-2 sm:max-w-sm md:max-w-md",
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              )}
            >
              <div className="text-sm">{msg.text}</div>
            </div>
          </div>
        ))}
        {isReplying && (
             <div className="flex items-end gap-2 justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2">
                    <div className="flex items-center justify-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></span>
                    </div>
                </div>
            </div>
        )}
      </div>
      <div className="p-4 border-t bg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Type your message..." {...field} disabled={isReplying} autoComplete="off"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isReplying}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
