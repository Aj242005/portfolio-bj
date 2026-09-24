import { Station } from '../types/station';

/**
 * Single source of truth for Bhavya Jain's portfolio stations.
 * Each station represents a transmission beacon — a vintage radio tower
 * scattered in the dark landscape around the radio.
 * 
 * Accent colors updated for warm retro radio palette.
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
    location: 'Remote',
    category: 'experience',
    accentColor: '#d4a853', // Warm Amber
    position3D: [-14, 2.5, -20],
    towerScale: 1.1,
    description:
      'Backend-engineering the Credit → Karma → KAT tokenomics pipeline (NestJS/Node.js, MySQL, JWT/bcrypt RBAC) for a multi-tenant DAO platform; built the immutable Credit ledger with period-cap enforcement, the three-tier KAT settlement cap cascade, and an OpenAI GPT-4o-mini-backed weekly reporting pipeline.',
    tech: ['NestJS', 'Node.js', 'MySQL', 'JWT/bcrypt RBAC', 'OpenAI GPT-4o-mini', 'DAO Tokenomics'],
    metrics: [
      { label: 'Ledger', value: 'Immutable Credit' },
      { label: 'Settlement', value: '3-Tier Cap Cascade' },
      { label: 'Reporting', value: 'GPT-4o-mini Pipeline' }
    ]
  },
  {
    id: 'digital-south-trust',
    frequency: 91.2,
    callsign: 'DST-CERT',
    title: 'Digital South Trust',
    role: 'Software Engineer Intern — Emerging Technologies',
    organization: 'Digital South Trust',
    period: 'March – July 2026',
    location: 'Remote',
    category: 'experience',
    accentColor: '#7ab648', // Warm Green (dial eye tube)
    position3D: [-8, 4.0, -28],
    towerScale: 1.25,
    description:
      'Architected a multi-tenant Certificate SaaS (Next.js, MongoDB Atlas, Stripe/Razorpay) and a Polygon certificate issuance pipeline via ethers.js anchoring hashes on-chain via Solidity smart contract (Amoy testnet) with idempotent retry and public on-chain verification.',
    tech: ['Next.js', 'MongoDB Atlas', 'Stripe', 'Razorpay', 'Polygon (Amoy)', 'ethers.js', 'Solidity'],
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
    role: 'Software Engineer Intern — Backend & Cryptography',
    organization: 'Lokachakra (UK-based startup)',
    period: 'June – Aug 2025',
    location: 'Remote',
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
    role: 'AlterBlock Project',
    organization: 'AlterBlock',
    period: '2025 – 2026',
    location: 'Open Source',
    category: 'project',
    accentColor: '#d4a853', // Warm Amber
    position3D: [12.5, 1.8, -19],
    towerScale: 1.15,
    description:
      'Sovereign P2P node with a two-phase ML-KEM-1024 post-quantum key encapsulation handshake establishing per-session AES-256-GCM channels; RISC Zero zkVM ZK Merkle membership proving against a Solana-anchored root; security audit surfaced and patched two critical verifier-bypass vulnerabilities.',
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
    role: 'B.Tech CS / Researcher / Hackathons',
    organization: 'B.M. Institute of Engineering and Technology',
    period: '2023 – 2027',
    location: 'New Delhi / Remote',
    category: 'origin',
    accentColor: '#d4a853', // Warm Amber
    position3D: [0, 5.2, -32],
    towerScale: 1.4,
    description:
      'B.Tech Computer Science, B.M. Institute of Engineering and Technology (2023–2027). Publication: "Post-Quantum Cryptography: Preparing for the Quantum Threat," G-CARED 2025 (international conference) — hybrid PQC migration strategies against Shor\'s/Grover\'s algorithms, benchmarked NIST PQC finalists. Semi-Finalist, Algorand Hackathon (Shakti — ZKP-enabled AI agent payment protocol). Participant, Stacks Bitcoin Framework Hacker House, Goa.',
    tech: [
      'B.Tech CS (2023–2027)',
      'G-CARED 2025 Publication',
      'Algorand Hackathon Semi-Finalist',
      'Stacks Hacker House Goa'
    ],
    metrics: [
      { label: 'Degree', value: 'B.Tech CS (2023–2027)' },
      { label: 'Paper', value: 'G-CARED 2025 PQC' },
      { label: 'Hackathon', value: 'Algorand Semi-Finalist' }
    ]
  }
];

export const MIN_FREQUENCY = 88.0;
export const MAX_FREQUENCY = 108.0;
export const FREQUENCY_STEP = 0.1;
export const LOCK_TOLERANCE = 0.35;
