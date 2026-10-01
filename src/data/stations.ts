import { Station } from '../types/station';

/**
 * Single source of truth for Bhavya Jain's portfolio stations.
 * Latest additions and corrections: supplied LinkedIn profile, Profile (9).pdf.
 * Earlier engineering projects remain available unless the new profile replaces a fact.
 */
export const STATIONS: Station[] = [
  {
    id: 'kambria',
    frequency: 88.5,
    callsign: 'KMBR-DAO',
    title: 'Kambria — KAT Tokenomics',
    role: 'Backend Developer',
    organization: 'System Prototyping DAO',
    period: 'May 2026 – Present',
    location: 'New Delhi',
    category: 'experience',
    accentColor: '#d4a853', // Warm Amber
    position3D: [-14, 2.5, -20],
    towerScale: 1.1,
    description:
      'Building the Credit → Karma → KAT tokenomics backend for a multi-tenant DAO platform: an immutable Credit ledger with period-cap enforcement, a three-tier settlement cap cascade (per-rule → per-contributor → DAO-wide), and an OpenAI GPT-4o-mini-backed weekly reporting pipeline.',
    tech: ['NestJS', 'Node.js', 'MySQL', 'JWT/bcrypt RBAC', 'OpenAI GPT-4o-mini', 'DAO Tokenomics'],
    metrics: [
      { label: 'Ledger', value: 'Immutable Credit' },
      { label: 'Settlement', value: '3-Tier Cap Cascade' },
      { label: 'Reporting', value: 'GPT-4o-mini Pipeline' }
    ]
  },
  {
    id: 'namo-labs',
    frequency: 89.8,
    callsign: 'NAMO-PQC',
    title: 'Namo Labs — Post-Quantum Migration',
    role: 'Research Associate — Cryptography',
    organization: 'Namo Labs',
    period: 'August 2026 – Present',
    location: 'New Delhi',
    category: 'research',
    accentColor: '#7ab648',
    position3D: [-11, 3, -23],
    description: 'Researching post-quantum cryptography migration for Namo Labs products. Evaluating candidate PQC protocols and proposing protocol-by-protocol replacements for classical cryptographic standards ahead of the quantum threat.',
    tech: ['Post-Quantum Cryptography', 'Protocol Evaluation', 'PQC Migration', 'Cryptographic Standards'],
    metrics: [
      { label: 'Focus', value: 'PQC Migration' },
      { label: 'Approach', value: 'Protocol-by-Protocol' },
      { label: 'Role', value: 'Research Associate' }
    ]
  },
  {
    id: 'digital-south-trust',
    frequency: 91.2,
    callsign: 'DST-CERT',
    title: 'Digital South Trust',
    role: 'Blockchain Intern',
    organization: 'Digital South Trust',
    period: 'March – July 2026',
    location: 'New Delhi',
    category: 'experience',
    accentColor: '#7ab648', // Warm Green (dial eye tube)
    position3D: [-8, 4.0, -28],
    towerScale: 1.25,
    description:
      'Architected a Certificate SaaS with org-scoped data isolation, OTP email authentication, and Stripe/Razorpay billing with plan-level quota enforcement. Designed a Polygon issuance pipeline anchoring certificate hashes and metadata URIs on Amoy through a Solidity contract, with idempotent retries and public verification.',
    tech: ['Next.js App Router', 'MongoDB Atlas', 'Mongoose', 'OTP Authentication', 'Stripe', 'Razorpay', 'Polygon (Amoy)', 'ethers.js', 'Solidity'],
    metrics: [
      { label: 'Network', value: 'Polygon Amoy Testnet' },
      { label: 'Verification', value: 'Public On-Chain' },
      { label: 'Payments', value: 'Stripe & Razorpay' }
    ]
  },
  {
    id: 'lokachakra',
    frequency: 94.0,
    callsign: 'LOKA-ZKP',
    title: 'Lokachakra',
    role: 'Blockchain and ZKP Intern',
    organization: 'Lokachakra (UK-based startup)',
    period: 'June – Aug 2025',
    location: 'New Delhi',
    category: 'experience',
    accentColor: '#c47832', // Warm Orange
    position3D: [-2.5, 1.2, -18],
    towerScale: 1.0,
    description:
      'Built a ZKP-based identity and KYC backend in Rust (Circom/Groth16, 10K+ users, 85% verification time reduction); engineered a cryptographically secure wallet system achieving 5,000+ TPS at sub-15ms latency.',
    tech: ['Rust', 'Circom', 'Groth16', 'Zero-Knowledge Proofs', 'KYC', 'High-TPS Engine'],
    metrics: [
      { label: 'Scale', value: '10K+ Users' },
      { label: 'Efficiency', value: '85% Time Reduction' },
      { label: 'Throughput', value: '5,000+ TPS (<15ms)' }
    ]
  },
  {
    id: 'pqc-research',
    frequency: 96.8,
    callsign: 'NIST-PQC',
    title: 'Post-Quantum Cryptography Research Initiative',
    role: 'Software Engineer Intern — Cryptography Research',
    organization: 'Research Initiative',
    period: 'Jan – May 2025',
    location: 'Remote',
    category: 'research',
    caseStudyUrl: 'https://ssrn.com/abstract=5286065',
    accentColor: '#7ab648', // Warm Green
    position3D: [5.5, 3.8, -24],
    towerScale: 1.2,
    description:
      'Benchmarked 4 NIST PQC finalist schemes against RSA/ECC; proposed hybrid migration strategies achieving 35% lower overhead for transitioning production cryptographic systems.',
    tech: ['Post-Quantum Cryptography', 'NIST PQC Finalists', 'ML-KEM', 'RSA/ECC', 'Hybrid Migration'],
    metrics: [
      { label: 'Evaluation', value: '4 NIST Finalists' },
      { label: 'Optimization', value: '35% Lower Overhead' },
      { label: 'Strategy', value: 'Hybrid Migration' }
    ]
  },
  {
    id: 'decomm',
    frequency: 99.6,
    callsign: 'DCOMM-P2P',
    title: 'Decomm — Quantum-Resistant P2P Infrastructure',
    role: 'Founder, AlterBlock / Project Builder',
    organization: 'AlterBlock',
    period: '2025 – 2026',
    location: 'Open Source',
    category: 'project',
    accentColor: '#d4a853', // Warm Amber
    position3D: [12.5, 1.8, -19],
    towerScale: 1.15,
    description:
      'Built sovereign P2P communication in Rust with ML-KEM-1024 key exchange and per-session AES-256-GCM channels. RISC Zero zkVM Merkle proofs are anchored to Solana and validated end-to-end with real 244 KB STARK receipts. A self-run security audit found and patched two critical verifier-bypass bugs. Founder of AlterBlock.',
    tech: ['Rust', 'libp2p Gossipsub', 'ML-KEM-1024', 'RISC Zero zkVM', 'AES-256-GCM', 'Solana'],
    metrics: [
      { label: 'Handshake', value: '2-Phase ML-KEM-1024' },
      { label: 'ZK Proving', value: 'RISC Zero zkVM' },
      { label: 'Audit Result', value: '2 Critical Fixes' }
    ]
  },
  {
    id: 'triad',
    frequency: 102.4,
    callsign: 'TRIAD-HFT',
    title: 'TRIAD — AI Market Microstructure Engine',
    role: 'Independent Project',
    organization: 'Independent',
    period: '2025 – 2026',
    location: 'Independent',
    category: 'project',
    accentColor: '#c47832', // Warm Orange
    position3D: [15, 4.5, -29],
    towerScale: 1.3,
    description:
      'Event-driven system ingesting live Binance L2 order-book depth, computing VPIN/spoofing/order-imbalance signals with a SHA-256 commitment hash chain; ONNX inference combined with per-regime HNSW episodic k-NN memory for sub-10ms decisions.',
    tech: ['Rust', 'Python', 'NATS JetStream', 'ONNX Runtime', 'PostgreSQL', 'pgvector', 'HNSW'],
    metrics: [
      { label: 'Execution', value: 'Sub-10ms Decisions' },
      { label: 'Feed', value: 'Live Binance L2 Depth' },
      { label: 'Signals', value: 'VPIN / Spoofing Chain' }
    ]
  },
  {
    id: 'codit',
    frequency: 103.8,
    callsign: 'CODIT-AUDIT',
    title: 'CODIT — Autonomous Codebase Audits',
    role: 'Independent Project',
    organization: 'CODIT',
    period: 'Project',
    location: 'coditt.xyz',
    category: 'project',
    accentColor: '#c47832',
    position3D: [11, 3, -26],
    caseStudyUrl: 'https://coditt.xyz/',
    description: 'Built an autonomous codebase audit platform that combines Tree-sitter static analysis with machine-learning defect-risk scoring. SHAP explanations make each risk assessment interpretable, connecting code structure to understandable audit findings.',
    tech: ['Tree-sitter', 'Static Analysis', 'Machine Learning', 'Defect-Risk Scoring', 'SHAP'],
    metrics: [
      { label: 'Analysis', value: 'Tree-sitter' },
      { label: 'Scoring', value: 'ML Defect Risk' },
      { label: 'Explanations', value: 'SHAP' }
    ]
  },
  {
    id: 'zk-vault',
    frequency: 105.2,
    callsign: 'ZK-VAULT',
    title: 'ZK Proof-of-Reserves Vault — ERC-4626 Yield',
    role: 'Open Source Project',
    organization: 'Open Source',
    period: '2024 – 2025',
    location: 'Sepolia Testnet',
    category: 'project',
    accentColor: '#b8975a', // Brass
    position3D: [-6.5, -0.8, -15],
    towerScale: 0.95,
    description:
      'Full-stack ZK-verifiable ERC-4626 yield vault with an off-chain Groth16 Proof-of-Reserves pipeline and auto-generated Solidity verifier; 5 contracts deployed and Etherscan-verified on Sepolia.',
    tech: ['Solidity', 'Foundry', 'Circom', 'Groth16', 'Aave V3', 'Next.js', 'Sepolia'],
    metrics: [
      { label: 'Protocol', value: 'ERC-4626 Standard' },
      { label: 'Contracts', value: '5 Verified on Sepolia' },
      { label: 'Proof System', value: 'Groth16 PoR Pipeline' }
    ]
  },
  {
    id: 'origin',
    frequency: 108.0,
    callsign: 'ORIGIN-SYS',
    title: 'Origin — Education, Publications & Honors',
    role: 'Final-year B.Tech CSE / Published Researcher',
    organization: 'B.M. Institute of Engineering and Technology',
    period: '2023 – 2027',
    location: 'Greater Delhi Area',
    category: 'origin',
    accentColor: '#d4a853', // Warm Amber
    position3D: [0, 5.2, -32],
    towerScale: 1.4,
    description:
      'Final-year B.Tech Computer Science and Engineering at BMIET, CGPA 9.00/10. Published "Post-Quantum Cryptography: Preparing for the Quantum Threat" at G-CARED 2025 (SSRN 5286065). Algorand Hackathon semi-finalist with Shakti, a ZKP-enabled AI agent payment protocol; Stacks Bitcoin Hacker House participant, Goa; Internal SIH Round Qualifier Team. Previously studied PCM at St. Andrews Scots Sr. Sec. School (April 2022–May 2023). Seeking internships and early-career roles in zkVMs, proof markets, ZK identity, and PQC migration.',
    tech: [
      'B.Tech CSE (2023–2027)',
      'CGPA 9.00/10',
      'G-CARED 2025 Publication',
      'Algorand Hackathon Semi-Finalist',
      'Stacks Hacker House Goa',
      'Internal SIH Round Qualifier Team'
    ],
    metrics: [
      { label: 'Degree', value: 'B.Tech CS (2023–2027)' },
      { label: 'CGPA', value: '9.00/10' },
      { label: 'Hackathon', value: 'Algorand Semi-Finalist' }
    ],
    links: [
      { label: 'Email Bhavya', url: 'mailto:jbhavya876@gmail.com' },
      { label: 'LinkedIn profile', url: 'https://www.linkedin.com/in/bhavya-jain-394484284' },
      { label: 'PQC publication · SSRN 5286065', url: 'https://ssrn.com/abstract=5286065' },
      { label: 'Personal website', url: 'https://bhavya-os.vercel.app/' },
      { label: 'Call · 9350807198', url: 'tel:+919350807198' }
    ]
  }
];

export const MIN_FREQUENCY = 88.0;
export const MAX_FREQUENCY = 108.0;
export const FREQUENCY_STEP = 0.1;
export const LOCK_TOLERANCE = 0.35;
