export interface ResearchSource {
  id: string;
  citation: string;
  domain: string;
  evidenceUse: string;
  url?: string;
}

export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    "id": "R01",
    "citation": "Anderson, L. W., & Krathwohl, D. R. (Eds.). (2001). A Taxonomy for Learning, Teaching, and Assessing.",
    "domain": "Bloom taxonomy",
    "evidenceUse": "Defines the six cognitive-process categories used for blueprint alignment.",
    "url": "https://www.loc.gov/item/00063423/"
  },
  {
    "id": "R02",
    "citation": "Sweller, J., Ayres, P., & Kalyuga, S. (2011). Cognitive Load Theory. Springer.",
    "domain": "cognitive load",
    "evidenceUse": "Supports controlling element interactivity and complexity across difficulty tiers.",
    "url": "https://link.springer.com/book/10.1007/978-1-4419-8126-4"
  },
  {
    "id": "R03",
    "citation": "Matz, M. (1980). Towards a computational theory of algebraic competence. Journal of Mathematical Behavior.",
    "domain": "algebra",
    "evidenceUse": "Classic analysis of systematic algebra errors and overgeneralized transformations.",
    "url": "https://eric.ed.gov/?id=ED212433"
  },
  {
    "id": "R04",
    "citation": "McNeil, N. M., & Alibali, M. W. (2005). Knowledge change as a function of mathematics experience: All contexts are not created equal. Journal of Cognition and Development.",
    "domain": "equality/algebra",
    "evidenceUse": "Supports relational-equality and equation-structure misconception targeting.",
    "url": "https://doi.org/10.1207/s15327647jcd0602_6"
  },
  {
    "id": "R05",
    "citation": "Booth, J. L., Barbieri, C., Eyer, F., & Paré-Blagoev, E. J. (2014). Persistent and pernicious errors in algebraic problem solving. Journal of Problem Solving.",
    "domain": "algebra",
    "evidenceUse": "Supports persistent sign, operation and symbolic-structure error families.",
    "url": "https://doi.org/10.7771/1932-6246.1161"
  },
  {
    "id": "R06",
    "citation": "Machaba, F. M. (2016). The concepts of area and perimeter: Insights and misconceptions of Grade 10 learners. Pythagoras, 37(1).",
    "domain": "geometry",
    "evidenceUse": "Direct evidence of confusion between area and perimeter and weak conceptual understanding.",
    "url": "https://doi.org/10.4102/pythagoras.v37i1.304"
  },
  {
    "id": "R07",
    "citation": "Luneta, K. (2015). Understanding students’ misconceptions: An analysis of final Grade 12 examination questions in geometry. Pythagoras, 36(1).",
    "domain": "geometry",
    "evidenceUse": "Supports geometry concept, representation and reasoning-error diagnostics.",
    "url": "https://doi.org/10.4102/pythagoras.v36i1.261"
  },
  {
    "id": "R08",
    "citation": "Yuliana, R., Novianty, E., & Yusuf, M. (2023). Analysis of concept understanding in the Pythagoras theorem. MaPan, 11(2).",
    "domain": "Pythagoras",
    "evidenceUse": "Supports targeted diagnostics for conceptual misunderstanding of the theorem.",
    "url": "https://doi.org/10.24252/mapan.2023v11n2a8"
  },
  {
    "id": "R09",
    "citation": "Weber, K. (2005). Students’ understanding of trigonometric functions. Mathematics Education Research Journal, 17(3), 91–112.",
    "domain": "trigonometry",
    "evidenceUse": "Empirical evidence that procedural instruction can leave limited understanding of trigonometric functions.",
    "url": "https://doi.org/10.1007/BF03217423"
  },
  {
    "id": "R10",
    "citation": "Rohimah, S. M., & Prabawanto, S. (2020). Students’ difficulties in solving trigonometric equations and identities. Journal of Physics: Conference Series, 1521, 032002.",
    "domain": "trigonometric equations",
    "evidenceUse": "Supports misconception targets involving identities, equations and algebraic manipulation.",
    "url": "https://doi.org/10.1088/1742-6596/1521/3/032002"
  },
  {
    "id": "R11",
    "citation": "Tunzana, V., Mukuka, A., & Tatira, B. (2025). Exploring Grade 11 learners’ understanding of trigonometric equations. Mathematics Teaching Research Journal, 17(2), 80–103.",
    "domain": "trigonometric equations",
    "evidenceUse": "Reports confusion of identities, quadrant behavior and algebraic manipulation.",
    "url": "https://eric.ed.gov/?id=EJ1474268"
  },
  {
    "id": "R12",
    "citation": "Chua, B. L., & Wood, E. (2005). Working with logarithms: Students’ misconceptions and errors. The Mathematics Educator, 8(2).",
    "domain": "logarithms",
    "evidenceUse": "Directly reports routine-vs-higher-level difficulties and overgeneralization of algebraic rules in logarithms.",
    "url": "https://math.nie.edu.sg/ame/matheduc/journal/v8_2/v82_53.aspx"
  },
  {
    "id": "R13",
    "citation": "Sevgi, S., & Akdemir Kabalcı, S. (2026). Students’ Misconceptions About Exponents. SAGE Open.",
    "domain": "indices/exponents",
    "evidenceUse": "Recent empirical analysis of specific exponent misconceptions using a diagnostic conceptual test.",
    "url": "https://doi.org/10.1177/21582440261449038"
  },
  {
    "id": "R14",
    "citation": "Çelik, A., & Özdemir, M. F. (2011). Determining the concept errors with regard to complex numbers in secondary education. Buca Faculty of Education Journal, 29.",
    "domain": "complex numbers",
    "evidenceUse": "Direct study of knowledge deficiencies and concept errors in complex numbers.",
    "url": "https://dergipark.org.tr/en/pub/deubefd/issue/25122/265285"
  },
  {
    "id": "R15",
    "citation": "Nordlander, M. C., & Nordlander, E. (2012). On the concept image of complex numbers. International Journal of Mathematical Education in Science and Technology, 43(5), 627–641.",
    "domain": "complex numbers",
    "evidenceUse": "Reports varied concept images and misconceptions, including difficulty with the basic property that real numbers are also complex numbers.",
    "url": "https://doi.org/10.1080/0020739X.2011.633629"
  },
  {
    "id": "R16",
    "citation": "Tall, D., & Vinner, S. (1981). Concept image and concept definition in mathematics with particular reference to limits and continuity. Educational Studies in Mathematics, 12, 151–169.",
    "domain": "concept formation",
    "evidenceUse": "Supports distinguishing memorized definitions from learners’ operational concept images.",
    "url": "https://doi.org/10.1007/BF00305619"
  },
  {
    "id": "R17",
    "citation": "Lave, J., & Wenger, E. (1991). Situated Learning: Legitimate Peripheral Participation. Cambridge University Press.",
    "domain": "TVET context",
    "evidenceUse": "Supports meaningful vocational contextualization; does not by itself prove field-specific misconception prevalence.",
    "url": "https://doi.org/10.1017/CBO9780511815355"
  },
  {
    "id": "R18",
    "citation": "Mayer, R. E. (2009). Multimedia Learning (2nd ed.). Cambridge University Press.",
    "domain": "visual learning",
    "evidenceUse": "Supports purposeful diagrams/representations where they reduce extraneous processing.",
    "url": "https://doi.org/10.1017/CBO9780511811678"
  },
  {
    "id": "R19",
    "citation": "Otero, N., Druga, S., & Lan, A. (2024). A Benchmark for Math Misconceptions: Bridging Gaps in Middle School Algebra with AI-Supported Instruction.",
    "domain": "AI misconception diagnostics",
    "evidenceUse": "Supports topic-constrained misconception datasets and educator validation for AI diagnostic generation.",
    "url": "https://arxiv.org/abs/2412.03765"
  }  ,{
    "id": "R20",
    "citation": "Wan Bakar, W. N., & Mohd Kanafiah, S. F. H. (2020). Misconception as Barrier in Understanding Index and Logarithm – The Case of Pre-Tertiary Education Students. Journal of Mathematics and Computing Science, 6(2), 20–25.",
    "domain": "Malaysia pre-diploma logarithms",
    "evidenceUse": "Direct Malaysian pre-diploma diagnostic evidence: 120 UiTM Kelantan students; reports BODMAS/log-rule difficulty and variable misinterpretation in logarithmic equations.",
    "url": "https://ir.uitm.edu.my/id/eprint/49078/"
  },
  {
    "id": "R21",
    "citation": "Ung, T. S., Lau, P. N. K., Manaf, B., Hamdan, A., & Chen, C. K. (2017). Cognitive Analysis as a Way to Understand Students’ Common Errors in Mathematics. AIP Conference Proceedings, 1830, 050002.",
    "domain": "Malaysia pre-diploma BODMAS",
    "evidenceUse": "Direct Malaysian pre-diploma evidence from UiTM Sarawak using solution-script analysis and interviews; identifies BODMAS errors involving arithmetic rules, negative numbers and powers.",
    "url": "https://doi.org/10.1063/1.4980939"
  }

];
