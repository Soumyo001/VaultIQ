import { guessCurrency } from "@/lib/engines/currency-detection-engine";
import OnboardingForm from "@/components/onboarding-form";
import { CurrencyCode } from "@/lib/utils/currency-util/currency";

const OnboardingPage = async () => {
  const currency = await guessCurrency();
  return <OnboardingForm initialCurrencyCode={currency}/>
}

export default OnboardingPage;