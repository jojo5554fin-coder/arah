import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Tailwind,
} from "@react-email/components";

interface WelcomeEmailProps {
  userFirstName?: string;
}

export const WelcomeEmail = ({ userFirstName = "there" }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to your personal growth journey with ARAH 🧭</Preview>
      <Tailwind>
        <Body className="bg-slate-50 my-auto mx-auto font-sans">
          <Container className="border border-solid border-slate-200 rounded my-[40px] mx-auto p-[20px] w-[465px] bg-white">
            <Heading className="text-slate-900 text-[24px] font-bold text-center p-0 my-[30px] mx-0">
              Welcome to ARAH 🧭
            </Heading>
            <Text className="text-slate-700 text-[16px] leading-[24px]">
              Hi {userFirstName},
            </Text>
            <Text className="text-slate-700 text-[16px] leading-[24px]">
              We're thrilled to have you on board! ARAH is your new direction for personal growth.
              We focus on building consistency and momentum, rather than punishing you for breaking streaks.
            </Text>
            <div className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-indigo-600 rounded text-white text-[14px] font-semibold no-underline text-center px-6 py-3"
                href="https://arah.my/dashboard"
              >
                Go to Dashboard
              </Button>
            </div>
            <Text className="text-slate-700 text-[16px] leading-[24px]">
              If you have any questions or feedback, just reply to this email. We'd love to hear from you.
            </Text>
            <Text className="text-slate-500 text-[12px] leading-[24px] mt-[24px]">
              Made with ❤️ in Malaysia.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
