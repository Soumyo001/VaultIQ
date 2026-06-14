import { guessCurrency } from "@/lib/engines/currency-detection-engine";
import OnboardingForm from "@/components/onboarding-form";
import { Suspense } from "react";

const OnboardingPage = async () => {
  const currency = await guessCurrency();
  return <OnboardingForm initialCurrency={currency}/>
}

export default OnboardingPage;