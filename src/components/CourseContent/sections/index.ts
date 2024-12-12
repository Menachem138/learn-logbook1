import { Section } from "../types";
import { welcomeSection } from "./welcome";
import { cryptoIntroSection } from "./cryptoIntro";
import { tradingIntroSection } from "./tradingIntro";
import { technicalAnalysisSection } from "./technicalAnalysis";
import { binanceSection } from "./binance";
import { explodingCoinsSection } from "./explodingCoins";
import { walletsSection } from "./wallets";
import { indicatorsSection } from "./indicators";
import { advancedLessonsSection } from "./advancedLessons";
import { liveSeminarSection } from "./liveSeminar";
import { wyckoffTheorySection } from "./wyckoffTheory";
import { marketStructureSection } from "./marketStructure";
import { glassesOfHaiTalSection } from "./glassesOfHaiTal";
import { liveSeminarConnectingPuzzleSection } from "./liveSeminarConnectingPuzzle";
import { liveSeminarWyckoffTheorySection } from "./liveSeminarWyckoffTheory";
import { advancedStrategiesSection } from "./advancedStrategies";
import { professorSeminarConvergencesSection } from "./professorSeminarConvergences";
import { professorSeminarTechnicalPatternsSection } from "./professorSeminarTechnicalPatterns";
import { liveQnASection1 } from "./liveQnA1";
import { liveQnASection2 } from "./liveQnA2";
import { tradingPlanSection } from "./tradingPlan";
import { flightStrategySection } from "./flightStrategy";
import { supplyAndDemandSection } from "./supplyAndDemand";
import { advancedSupplyAndDemandSection } from "./advancedSupplyAndDemand";
import { liquiditySeminarSection } from "./liquiditySeminar";
import { spotTradingSeminarSection } from "./spotTradingSeminar";
import { mentalToolsSeminarSection } from "./mentalToolsSeminar";
import { weeklyReviewsSection } from "./weeklyReviews";
import { weeklyReviewAprilSection } from "./weeklyReviewApril";

export const sections: Section[] = [
  welcomeSection,
  cryptoIntroSection,
  tradingIntroSection,
  technicalAnalysisSection,
  binanceSection,
  explodingCoinsSection,
  walletsSection,
  indicatorsSection,
  advancedLessonsSection,
  liveSeminarSection,
  wyckoffTheorySection,
  marketStructureSection,
  glassesOfHaiTalSection,
  liveSeminarConnectingPuzzleSection,
  liveSeminarWyckoffTheorySection,
  advancedStrategiesSection,
  professorSeminarConvergencesSection,
  professorSeminarTechnicalPatternsSection,
  liveQnASection1,
  liveQnASection2,
  tradingPlanSection,
  flightStrategySection,
  supplyAndDemandSection,
  advancedSupplyAndDemandSection,
  liquiditySeminarSection,
  spotTradingSeminarSection,
  mentalToolsSeminarSection,
  weeklyReviewsSection,
  weeklyReviewAprilSection
];

export const getTotalLessons = () => {
  return sections.reduce((total, section) => total + section.lessons.length, 0);
};

export const getSectionTitle = (index: number) => {
  return `${index + 1}. ${sections[index].title}`;
};