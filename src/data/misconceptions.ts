export type EvidenceStrength = 'direct-malaysian-tvet' | 'direct' | 'supported' | 'structure-grounded';

export const MISCONCEPTIONS = {
  "ALG-OPS-01": {
    "subtopicCode": "1.1",
    "name": "Like/unlike term confusion",
    "example": "Combines unlike terms as if they are like terms, e.g. 3x+5y→8xy.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "ALG-OPS-02": {
    "subtopicCode": "1.1",
    "name": "Coefficient-variable-exponent role confusion",
    "example": "Misidentifies coefficient, variable, exponent or constant.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-OPS-03": {
    "subtopicCode": "1.1",
    "name": "BODMAS/order-of-operations error",
    "example": "Applies operations in an incorrect order or ignores grouping.",
    "researchSourceIds": [
      "R21",
      "R20",
      "R02"
    ],
    "evidenceStrength": "direct-malaysian-tvet",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-OPS-04": {
    "subtopicCode": "1.1",
    "name": "Bracket/sign removal error",
    "example": "Removes brackets without correctly propagating signs.",
    "researchSourceIds": [
      "R05"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "ALG-EQ-01": {
    "subtopicCode": "1.2a",
    "name": "One-sided equation-operation error",
    "example": "Performs an operation on one side of an equation without applying the same operation to the other side.",
    "researchSourceIds": [
      "R04",
      "R05"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by empirical equality/algebra research. Local TVET prevalence still requires cohort validation before making prevalence claims.",
    "localValidationRequired": false
  },
  "ALG-EQ-02": {
    "subtopicCode": "1.2a",
    "name": "Inverse-operation sign error",
    "example": "Moves a term across an equation with the wrong sign or applies the wrong inverse operation.",
    "researchSourceIds": [
      "R04",
      "R05"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by empirical equality/algebra research. Local TVET prevalence still requires cohort validation before making prevalence claims.",
    "localValidationRequired": false
  },
  "ALG-EQ-03": {
    "subtopicCode": "1.2a",
    "name": "Zero-product/root interpretation error",
    "example": "Solves a quadratic equation after factorization but does not set each factor equal to zero.",
    "researchSourceIds": [
      "R03",
      "R04",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The exact equation item should be locally validated, but the broader symbolic-structure and equality misconception family is research-supported.",
    "localValidationRequired": true
  },
  "ALG-EQ-04": {
    "subtopicCode": "1.2a",
    "name": "Root checking/substitution error",
    "example": "Accepts an algebraic root without checking it in the original equation or substitutes it into the wrong expression.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The exact equation item should be locally validated, but the broader symbolic-structure and algebraic checking difficulty is research-supported.",
    "localValidationRequired": true
  },
  "ALG-EF-01": {
    "subtopicCode": "1.2b",
    "name": "Distribution omission",
    "example": "Expands a(b+c) as ab+c.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "ALG-EF-02": {
    "subtopicCode": "1.2b",
    "name": "Negative distribution/sign error",
    "example": "Expands -a(b+c) with an incorrect sign on one term.",
    "researchSourceIds": [
      "R05"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "ALG-EF-03": {
    "subtopicCode": "1.2b",
    "name": "Special-product structure confusion",
    "example": "Misuses difference-of-squares/perfect-square identities.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-EF-04": {
    "subtopicCode": "1.2b",
    "name": "Quadratic factor/root structure error",
    "example": "Uses factor pairs or zero-product reasoning incorrectly.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-FORM-01": {
    "subtopicCode": "1.3",
    "name": "Inverse-operation transposition error",
    "example": "Moves a term or factor using the wrong inverse operation.",
    "researchSourceIds": [
      "R04",
      "R05"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "ALG-FORM-02": {
    "subtopicCode": "1.3",
    "name": "One-sided equivalence error",
    "example": "Performs an operation on only one side of an equation/formula.",
    "researchSourceIds": [
      "R04"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "ALG-FORM-03": {
    "subtopicCode": "1.3",
    "name": "Incomplete substitution",
    "example": "Substitutes into only some occurrences or the wrong symbol.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-FORM-04": {
    "subtopicCode": "1.3",
    "name": "Formula order/grouping error",
    "example": "Misreads a numerator, denominator or bracket when evaluating a formula.",
    "researchSourceIds": [
      "R02",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-SIM-01": {
    "subtopicCode": "1.4",
    "name": "Elimination sign/coefficient error",
    "example": "Adds/subtracts equations before matching coefficients correctly.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-SIM-02": {
    "subtopicCode": "1.4",
    "name": "Substitution expression error",
    "example": "Substitutes the wrong expression or does not preserve brackets.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-SIM-03": {
    "subtopicCode": "1.4",
    "name": "Solution-pair misconception",
    "example": "Accepts a value pair that satisfies only one equation.",
    "researchSourceIds": [
      "R04"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-SIM-04": {
    "subtopicCode": "1.4",
    "name": "Context-to-system modelling error",
    "example": "Forms one or both equations incorrectly from a verbal TVET context.",
    "researchSourceIds": [
      "R03",
      "R17"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-POLY-01": {
    "subtopicCode": "1.5",
    "name": "Polynomial degree/term classification error",
    "example": "Identifies degree from a coefficient or classifies non-polynomial powers as polynomial.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-POLY-02": {
    "subtopicCode": "1.5",
    "name": "Unlike-power alignment error",
    "example": "Combines terms with different exponents during addition/subtraction.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "ALG-POLY-03": {
    "subtopicCode": "1.5",
    "name": "Multiplication/distribution omission",
    "example": "Fails to multiply every required polynomial term.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "ALG-POLY-04": {
    "subtopicCode": "1.5",
    "name": "Polynomial division place-value error",
    "example": "Omits zero-power placeholders or misaligns powers during division.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "structure-grounded",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-PF-01": {
    "subtopicCode": "1.6",
    "name": "Partial-fraction setup error",
    "example": "Uses a decomposition that does not match the denominator factors.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "structure-grounded",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-PF-02": {
    "subtopicCode": "1.6",
    "name": "Repeated/linear factor numerator error",
    "example": "Uses an inappropriate numerator form for the allowed linear-factor case.",
    "researchSourceIds": [
      "R03"
    ],
    "evidenceStrength": "structure-grounded",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-PF-03": {
    "subtopicCode": "1.6",
    "name": "Coefficient comparison error",
    "example": "Equates coefficients incorrectly after recombination.",
    "researchSourceIds": [
      "R03",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "ALG-PF-04": {
    "subtopicCode": "1.6",
    "name": "Recombination verification failure",
    "example": "Does not check that decomposed fractions reproduce the original numerator.",
    "researchSourceIds": [
      "R03",
      "R19"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-PYT-01": {
    "subtopicCode": "2.1",
    "name": "Hypotenuse identification error",
    "example": "Treats a non-opposite-to-right-angle side as the hypotenuse.",
    "researchSourceIds": [
      "R07",
      "R08"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "GEO-PYT-02": {
    "subtopicCode": "2.1",
    "name": "Pythagoras used on a non-right triangle",
    "example": "Applies a²+b²=c² without verifying a right angle.",
    "researchSourceIds": [
      "R07",
      "R08"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-PYT-03": {
    "subtopicCode": "2.1",
    "name": "Wrong unknown-side rearrangement",
    "example": "Adds when subtraction is required for a leg or misplaces the squared unknown.",
    "researchSourceIds": [
      "R08",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-PYT-04": {
    "subtopicCode": "2.1",
    "name": "Square/root sequencing error",
    "example": "Forgets to square a side or forgets the final square root.",
    "researchSourceIds": [
      "R08",
      "R02"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-PA-01": {
    "subtopicCode": "2.2",
    "name": "Area-perimeter confusion",
    "example": "Uses an area formula for perimeter or vice versa.",
    "researchSourceIds": [
      "R06"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "GEO-PA-02": {
    "subtopicCode": "2.2",
    "name": "Length-unit vs square-unit confusion",
    "example": "Reports area in linear units or perimeter in square units.",
    "researchSourceIds": [
      "R06",
      "R07"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-PA-03": {
    "subtopicCode": "2.2",
    "name": "Composite-shape omission/overlap",
    "example": "Adds component areas without accounting for missing/overlapping regions.",
    "researchSourceIds": [
      "R07"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-PA-04": {
    "subtopicCode": "2.2",
    "name": "Wrong dimension selection",
    "example": "Uses diameter as radius, slant/diagonal as side, or wrong height/base.",
    "researchSourceIds": [
      "R06",
      "R07"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-SV-01": {
    "subtopicCode": "2.3",
    "name": "Surface-area vs volume confusion",
    "example": "Uses a volume formula when surface area is requested or vice versa.",
    "researchSourceIds": [
      "R07",
      "R02"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-SV-02": {
    "subtopicCode": "2.3",
    "name": "Square-unit vs cubic-unit confusion",
    "example": "Reports volume in square units or surface area in cubic units.",
    "researchSourceIds": [
      "R07"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-SV-03": {
    "subtopicCode": "2.3",
    "name": "Missing/excess face in surface area",
    "example": "Omits a face or includes an internal/shared face in a composite solid.",
    "researchSourceIds": [
      "R07"
    ],
    "evidenceStrength": "structure-grounded",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-SV-04": {
    "subtopicCode": "2.3",
    "name": "Radius/diameter or height confusion",
    "example": "Substitutes the wrong geometric dimension into a solid formula.",
    "researchSourceIds": [
      "R07"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-CIRC-01": {
    "subtopicCode": "2.4",
    "name": "Degree-radian conversion inversion",
    "example": "Multiplies by 180/π instead of π/180, or vice versa.",
    "researchSourceIds": [
      "R07",
      "R02"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-CIRC-02": {
    "subtopicCode": "2.4",
    "name": "Radius-diameter confusion",
    "example": "Uses diameter where a formula requires radius.",
    "researchSourceIds": [
      "R06",
      "R07"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-CIRC-03": {
    "subtopicCode": "2.4",
    "name": "Arc length vs sector area confusion",
    "example": "Selects the formula for the wrong circular quantity.",
    "researchSourceIds": [
      "R06",
      "R07"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "GEO-CIRC-04": {
    "subtopicCode": "2.4",
    "name": "Angle-unit inconsistency",
    "example": "Uses a radian-based formula with degree input without conversion.",
    "researchSourceIds": [
      "R02",
      "R07"
    ],
    "evidenceStrength": "structure-grounded",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-INTRO-01": {
    "subtopicCode": "3.1",
    "name": "Degree-radian equivalence error",
    "example": "Does not recognize π radians as 180° or scales conversion incorrectly.",
    "researchSourceIds": [
      "R09",
      "R02"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-INTRO-02": {
    "subtopicCode": "3.1",
    "name": "Calculator angle-mode mismatch",
    "example": "Interprets a value produced in the wrong degree/radian mode as mathematically valid.",
    "researchSourceIds": [
      "R09",
      "R02"
    ],
    "evidenceStrength": "structure-grounded",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-INTRO-03": {
    "subtopicCode": "3.1",
    "name": "Angle-unit omission",
    "example": "Treats degree and radian numerical values as interchangeable.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-INTRO-04": {
    "subtopicCode": "3.1",
    "name": "Reference/full-turn scaling error",
    "example": "Mis-scales fractions of a full turn between 360° and 2π.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-RATIO-01": {
    "subtopicCode": "3.2",
    "name": "Opposite/adjacent side confusion",
    "example": "Labels opposite and adjacent without reference to the chosen acute angle.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "TRI-RATIO-02": {
    "subtopicCode": "3.2",
    "name": "Trig-ratio selection error",
    "example": "Uses sine/cosine/tangent with the wrong known/unknown side relationship.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "TRI-RATIO-03": {
    "subtopicCode": "3.2",
    "name": "Inverse-function confusion",
    "example": "Treats sin⁻¹ as 1/sin or uses inverse trig on an angle instead of a ratio.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "TRI-RATIO-04": {
    "subtopicCode": "3.2",
    "name": "Reciprocal-ratio confusion",
    "example": "Confuses csc, sec, cot with inverse trigonometric functions.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-GRAPH-01": {
    "subtopicCode": "3.3",
    "name": "Amplitude/vertical-scale confusion",
    "example": "Misinterprets k in y=k sinθ or y=k cosθ.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-GRAPH-02": {
    "subtopicCode": "3.3",
    "name": "Frequency/period confusion",
    "example": "Treats k in sin(kθ) as amplitude instead of changing period.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "TRI-GRAPH-03": {
    "subtopicCode": "3.3",
    "name": "Sine-cosine starting-point confusion",
    "example": "Interchanges key features of sine and cosine graphs.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-GRAPH-04": {
    "subtopicCode": "3.3",
    "name": "Tangent discontinuity/period error",
    "example": "Draws tangent as continuous through asymptotes or uses the sine/cosine period.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-EQ-01": {
    "subtopicCode": "3.4",
    "name": "Quadrant-sign error",
    "example": "Uses an incorrect sign or misses valid quadrants for a trigonometric ratio.",
    "researchSourceIds": [
      "R10",
      "R11"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "TRI-EQ-02": {
    "subtopicCode": "3.4",
    "name": "Incomplete solution-set error",
    "example": "Reports only a principal calculator answer within a required interval.",
    "researchSourceIds": [
      "R10",
      "R11"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "TRI-EQ-03": {
    "subtopicCode": "3.4",
    "name": "Identity/formula confusion",
    "example": "Applies an inappropriate trigonometric identity.",
    "researchSourceIds": [
      "R10",
      "R11"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "TRI-EQ-04": {
    "subtopicCode": "3.4",
    "name": "Algebraic manipulation error",
    "example": "Cancels/factorizes trigonometric expressions incorrectly.",
    "researchSourceIds": [
      "R10",
      "R11"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "TRI-SINE-01": {
    "subtopicCode": "3.5.1",
    "name": "Non-opposite pairing in Sine Rule",
    "example": "Pairs a side with an angle that is not opposite it.",
    "researchSourceIds": [
      "R09",
      "R16"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-SINE-02": {
    "subtopicCode": "3.5.1",
    "name": "Sine Rule used with insufficient matching pair",
    "example": "Chooses Sine Rule when no known opposite side-angle pair supports it.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "structure-grounded",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-SINE-03": {
    "subtopicCode": "3.5.1",
    "name": "Angle-side inversion error",
    "example": "Inverts one side-angle ratio inconsistently.",
    "researchSourceIds": [
      "R09",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-SINE-04": {
    "subtopicCode": "3.5.1",
    "name": "Ambiguous-case oversight",
    "example": "Accepts a single triangle when the given SSA data can require checking alternatives.",
    "researchSourceIds": [
      "R09",
      "R16"
    ],
    "evidenceStrength": "structure-grounded",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-COS-01": {
    "subtopicCode": "3.5.2",
    "name": "Cosine Rule selection error",
    "example": "Uses Cosine Rule without matching the known SAS/SSS structure.",
    "researchSourceIds": [
      "R09",
      "R16"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-COS-02": {
    "subtopicCode": "3.5.2",
    "name": "Included-angle confusion",
    "example": "Uses a non-included angle in the side formula.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-COS-03": {
    "subtopicCode": "3.5.2",
    "name": "Negative cosine term sign error",
    "example": "Uses +2ab cosC where the side formula requires subtraction.",
    "researchSourceIds": [
      "R05",
      "R09"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-COS-04": {
    "subtopicCode": "3.5.2",
    "name": "Inverse-cosine evaluation error",
    "example": "Fails to isolate cosC correctly before applying cos⁻¹.",
    "researchSourceIds": [
      "R09",
      "R05"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-AREA-01": {
    "subtopicCode": "3.5.3",
    "name": "Included-angle error",
    "example": "Uses an angle that is not between the two selected sides in 1/2 ab sinC.",
    "researchSourceIds": [
      "R09"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-AREA-02": {
    "subtopicCode": "3.5.3",
    "name": "Triangle-area formula confusion",
    "example": "Uses 1/2bh with a non-perpendicular 'height' or omits sine in the oblique formula.",
    "researchSourceIds": [
      "R09",
      "R07"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-AREA-03": {
    "subtopicCode": "3.5.3",
    "name": "Degree/radian calculator mismatch",
    "example": "Evaluates sinC in the wrong angle mode.",
    "researchSourceIds": [
      "R09",
      "R02"
    ],
    "evidenceStrength": "structure-grounded",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "TRI-AREA-04": {
    "subtopicCode": "3.5.3",
    "name": "Area-unit confusion",
    "example": "Reports a triangle area in linear instead of square units.",
    "researchSourceIds": [
      "R06",
      "R07"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "IND-01": {
    "subtopicCode": "4.1",
    "name": "Addition/subtraction treated as exponent law",
    "example": "Assumes a^m+a^n=a^(m+n) or a^m-a^n=a^(m-n).",
    "researchSourceIds": [
      "R13"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "IND-02": {
    "subtopicCode": "4.1",
    "name": "Product/quotient exponent-law error",
    "example": "Adds/subtracts exponents when bases differ or applies the law to the wrong operation.",
    "researchSourceIds": [
      "R13"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "IND-03": {
    "subtopicCode": "4.1",
    "name": "Power-of-a-power multiplication error",
    "example": "Uses (a^m)^n=a^(m+n) instead of a^(mn).",
    "researchSourceIds": [
      "R13"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "IND-04": {
    "subtopicCode": "4.1",
    "name": "Negative/zero exponent misconception",
    "example": "Treats a^-n as negative a^n or a^0 as 0.",
    "researchSourceIds": [
      "R13"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "LOG-01": {
    "subtopicCode": "4.2",
    "name": "Product law as multiplication of logs",
    "example": "Uses log(MN)=logM×logN.",
    "researchSourceIds": [
      "R12"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "LOG-02": {
    "subtopicCode": "4.2",
    "name": "Quotient law as division of logs",
    "example": "Uses log(M/N)=logM÷logN.",
    "researchSourceIds": [
      "R12"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "LOG-03": {
    "subtopicCode": "4.2",
    "name": "Power law exponent-placement error",
    "example": "Uses log(M^k)=(logM)^k instead of klogM.",
    "researchSourceIds": [
      "R12"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "LOG-04": {
    "subtopicCode": "4.2",
    "name": "Base/argument/domain confusion",
    "example": "Treats log of a non-positive real argument as an ordinary real value or ignores the base.",
    "researchSourceIds": [
      "R12"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "LOG-CONV-01": {
    "subtopicCode": "4.3",
    "name": "Base-exponent-result role reversal",
    "example": "Misplaces base, exponent or result when converting a^x=y ↔ log_a y=x.",
    "researchSourceIds": [
      "R12"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "LOG-CONV-02": {
    "subtopicCode": "4.3",
    "name": "Logarithm as multiplication/division misconception",
    "example": "Interprets log_a y as a÷y or ay.",
    "researchSourceIds": [
      "R12"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "LOG-CONV-03": {
    "subtopicCode": "4.3",
    "name": "Base omission",
    "example": "Writes a logarithmic form without preserving the original exponential base.",
    "researchSourceIds": [
      "R12"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "LOG-CONV-04": {
    "subtopicCode": "4.3",
    "name": "Inverse relationship not recognized",
    "example": "Treats exponential and logarithmic forms as unrelated formulas.",
    "researchSourceIds": [
      "R12",
      "R16"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "IND-EQ-01": {
    "subtopicCode": "4.4",
    "name": "Invalid base comparison",
    "example": "Equates exponents before expressing both sides with a common base.",
    "researchSourceIds": [
      "R13"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "IND-EQ-02": {
    "subtopicCode": "4.4",
    "name": "Index-law misuse while simplifying equation",
    "example": "Applies product/quotient/power laws incorrectly.",
    "researchSourceIds": [
      "R13"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "IND-EQ-03": {
    "subtopicCode": "4.4",
    "name": "Logarithm conversion error",
    "example": "Introduces logarithms but misuses log laws or omits a side.",
    "researchSourceIds": [
      "R12",
      "R13"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "IND-EQ-04": {
    "subtopicCode": "4.4",
    "name": "Method-selection rigidity",
    "example": "Forces one method even when a simpler common-base/log method is required.",
    "researchSourceIds": [
      "R02",
      "R16"
    ],
    "evidenceStrength": "structure-grounded",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "LOG-EQ-01": {
    "subtopicCode": "4.5",
    "name": "Log-law misuse in equation solving",
    "example": "Combines logarithms with an invalid product/quotient/power transformation.",
    "researchSourceIds": [
      "R20",
      "R12"
    ],
    "evidenceStrength": "direct-malaysian-tvet",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "LOG-EQ-02": {
    "subtopicCode": "4.5",
    "name": "Domain restriction ignored",
    "example": "Accepts a solution making a logarithm argument non-positive.",
    "researchSourceIds": [
      "R12"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "LOG-EQ-03": {
    "subtopicCode": "4.5",
    "name": "Invalid base/argument comparison",
    "example": "Equates arguments when bases/conditions do not support the step.",
    "researchSourceIds": [
      "R12"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "LOG-EQ-04": {
    "subtopicCode": "4.5",
    "name": "Index-log conversion error",
    "example": "Converts between logarithmic and exponential form with roles reversed.",
    "researchSourceIds": [
      "R12"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "CPLX-I-01": {
    "subtopicCode": "5.1",
    "name": "i² sign misconception",
    "example": "Treats i² as +1 rather than -1.",
    "researchSourceIds": [
      "R14",
      "R15"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "CPLX-I-02": {
    "subtopicCode": "5.1",
    "name": "Square root of negative-number sign error",
    "example": "Writes √(-a)= -√a or omits i.",
    "researchSourceIds": [
      "R14"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "CPLX-I-03": {
    "subtopicCode": "5.1",
    "name": "Powers-of-i cycle error",
    "example": "Does not use the four-step cycle of powers of i correctly.",
    "researchSourceIds": [
      "R14"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "CPLX-I-04": {
    "subtopicCode": "5.1",
    "name": "Real/imaginary/complex classification error",
    "example": "Assumes real numbers are not complex numbers.",
    "researchSourceIds": [
      "R15"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "CPLX-RECT-01": {
    "subtopicCode": "5.2",
    "name": "Real and imaginary parts combined incorrectly",
    "example": "Adds real terms to imaginary coefficients without preserving i.",
    "researchSourceIds": [
      "R14",
      "R15"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "CPLX-RECT-02": {
    "subtopicCode": "5.2",
    "name": "Argand axis swap",
    "example": "Plots real part on vertical axis or imaginary part on horizontal axis.",
    "researchSourceIds": [
      "R14",
      "R15"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "CPLX-RECT-03": {
    "subtopicCode": "5.2",
    "name": "Complex multiplication i² error",
    "example": "Expands products but treats i² incorrectly.",
    "researchSourceIds": [
      "R14"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "CPLX-RECT-04": {
    "subtopicCode": "5.2",
    "name": "Conjugate/division error",
    "example": "Uses the wrong conjugate or fails to obtain a real denominator.",
    "researchSourceIds": [
      "R14",
      "R15"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "CPLX-POLAR-01": {
    "subtopicCode": "5.3",
    "name": "Modulus formula error",
    "example": "Uses a+b or a²+b² without the square root for |a+bi|.",
    "researchSourceIds": [
      "R14",
      "R15"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "CPLX-POLAR-02": {
    "subtopicCode": "5.3",
    "name": "Argument quadrant error",
    "example": "Uses arctan(b/a) without correcting for the point's quadrant.",
    "researchSourceIds": [
      "R14",
      "R15"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  },
  "CPLX-POLAR-03": {
    "subtopicCode": "5.3",
    "name": "Polar angle-unit inconsistency",
    "example": "Mixes degrees and radians within one representation/calculation.",
    "researchSourceIds": [
      "R14",
      "R02"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "CPLX-POLAR-04": {
    "subtopicCode": "5.3",
    "name": "Rectangular-polar component swap",
    "example": "Uses r sinθ for real and r cosθ for imaginary without the adopted convention.",
    "researchSourceIds": [
      "R14",
      "R15"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "CPLX-DM-01": {
    "subtopicCode": "5.4",
    "name": "Angle not multiplied by power",
    "example": "Raises modulus but leaves the argument unchanged in De Moivre.",
    "researchSourceIds": [
      "R14",
      "R15"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "CPLX-DM-02": {
    "subtopicCode": "5.4",
    "name": "Modulus not raised to power",
    "example": "Multiplies angle but forgets r^n.",
    "researchSourceIds": [
      "R14",
      "R15"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "CPLX-DM-03": {
    "subtopicCode": "5.4",
    "name": "Trig-form sign/component error",
    "example": "Switches sine/cosine or mishandles signs after angle multiplication.",
    "researchSourceIds": [
      "R14",
      "R15"
    ],
    "evidenceStrength": "supported",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": true
  },
  "CPLX-DM-04": {
    "subtopicCode": "5.4",
    "name": "Power interpreted componentwise in rectangular form",
    "example": "Raises real and imaginary parts separately as if (a+bi)^n=a^n+b^ni.",
    "researchSourceIds": [
      "R14",
      "R15"
    ],
    "evidenceStrength": "direct",
    "researchAlignment": "The distractor/error family is constrained by the cited mathematics-education evidence. 'Supported' and 'structure-grounded' items must not be described as having a known prevalence without local validation.",
    "localValidationRequired": false
  }
} as const;
