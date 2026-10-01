import { Bloom, EffectComposer } from '@react-three/postprocessing';
export function PostProcessing() {
  return <EffectComposer multisampling={0} enableNormalPass={false}><Bloom intensity={0.32} luminanceThreshold={1.6} luminanceSmoothing={0.4} mipmapBlur /></EffectComposer>;
}
