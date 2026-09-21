/** Authored impact recipe, not a downloaded recording or a realism claim.
 * Three short, deterministic mono variants avoid both a melodic chip "beep"
 * and random allocations on every wager. Resonances are deliberately
 * inharmonic; the noise/contact transient decays before the thin shell ring.
 * Unit tests can bound PCM and nodes, but only listening can approve timbre. */
export function chipSamples(sampleRate:number,variant:number):Float32Array<ArrayBuffer> {
  const pcm=new Float32Array(Math.ceil(sampleRate*.18))
  let seed=0x71f392+variant*7919
  const hits=[0,.027+variant*.003,.064-variant*.002]
  for(let i=0;i<pcm.length;i++){
    const t=i/sampleRate
    seed=(Math.imul(seed,1664525)+1013904223)>>>0
    const noise=seed/0x100000000*2-1
    let value=0
    hits.forEach((hit,j)=>{
      const age=t-hit
      if(age<0)return
      const attack=Math.min(1,age/.0008),weight=[1,.58,.34][j]
      const tune=1+variant*.037+j*.011
      const ring=(Math.sin(age*2*Math.PI*2380*tune)+.48*Math.sin(age*2*Math.PI*3670*tune)+.23*Math.sin(age*2*Math.PI*5170*tune))*.16*Math.exp(-age/ .012)
      const contact=.18*noise*Math.exp(-age/.0028)+.13*Math.sin(age*2*Math.PI*310)*Math.exp(-age/.007)
      value+=(ring+contact)*attack*weight
    })
    pcm[i]=value*Math.min(1,(pcm.length-1-i)/(sampleRate*.008))
  }
  pcm[0]=0;pcm[pcm.length-1]=0
  return pcm
}

/** PokerAudio-only owner. AudioBufferSourceNodes are one-shot, buffers reusable:
 * https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
 * One source represents the whole small chip cluster, not one node per chip.
 * A six-voice cap also bounds unexpected event bursts without a future queue. */
export class ChipFoley {
  private buffers:AudioBuffer[]
  private voices=new Map<AudioBufferSourceNode,()=>void>()
  private next=0
  private disposed=false
  constructor(private context:AudioContext,private output:AudioNode){
    this.buffers=[0,1,2].map(variant=>{
      const pcm=chipSamples(context.sampleRate,variant)
      const buffer=context.createBuffer(1,pcm.length,context.sampleRate)
      buffer.copyToChannel(pcm,0);return buffer
    })
  }
  play():void {
    if(this.disposed)return
    if(this.voices.size>=6)this.release(this.voices.keys().next().value!)
    const source=this.context.createBufferSource()
    source.buffer=this.buffers[this.next++%this.buffers.length]
    const cleanup=()=>{source.onended=null;source.disconnect();this.voices.delete(source)}
    this.voices.set(source,cleanup);source.onended=cleanup
    source.connect(this.output);source.start(this.context.currentTime)
  }
  private release(source:AudioBufferSourceNode):void {
    const cleanup=this.voices.get(source)
    if(!cleanup)return
    source.onended=null;source.stop();cleanup()
  }
  stop():void {for(const source of this.voices.keys())this.release(source)}
  dispose():void {this.disposed=true;this.stop();this.buffers=[]}
}
