import { BufferAttribute, BufferGeometry, CanvasTexture, Points, PointsMaterial } from 'three'

/** ChristmasTavern alone owns this bounded outside-window layer. The retained
 * seated camera projected the former .010 flakes to .995 buffer pixels: making
 * more subpixel flakes recreated static without readable snowfall. Increase
 * their footprint instead, preserving the original84 seeds and24Hz simulation.
 * This is a visibility candidate, not a measured FPS/perceptual claim. */
export class WindowSnow {
  readonly mesh:Points<BufferGeometry,PointsMaterial>
  private readonly texture:CanvasTexture
  private readonly seeds:{x:number;y:number;speed:number;drift:number}[]=[]
  private tick=-1
  private disposed=false
  constructor(){
    const canvas=document.createElement('canvas');canvas.width=canvas.height=32
    const g=canvas.getContext('2d')!,gradient=g.createRadialGradient(16,16,0,16,16,16)
    gradient.addColorStop(0,'#ffffff');gradient.addColorStop(.5,'#ffffffbb');gradient.addColorStop(1,'#ffffff00')
    g.fillStyle=gradient;g.fillRect(0,0,32,32);this.texture=new CanvasTexture(canvas)
    const frac=(v:number)=>v-Math.floor(v)
    for(let i=0;i<84;i++)this.seeds.push({x:frac(Math.sin(i*12.9)*43758),y:frac(Math.sin(i*37.1+2)*23421),speed:.045+frac(Math.sin(i*8.7)*29341)*.07,drift:.028+i%7*.008})
    const geometry=new BufferGeometry().setAttribute('position',new BufferAttribute(new Float32Array(84*3),3))
    this.mesh=new Points(geometry,new PointsMaterial({color:'#aabccb',size:.044,map:this.texture,transparent:true,opacity:.65,depthWrite:false}))
    this.mesh.name='window-snow';this.mesh.frustumCulled=false
    this.frame(0,false)
  }
  frame(time:number,reduced:boolean):void{
    const next=reduced?0:Math.floor(time*24)
    if(this.disposed||next===this.tick)return
    this.tick=next
    const t=reduced?0:time,positions=this.mesh.geometry.getAttribute('position') as BufferAttribute
    this.seeds.forEach((seed,i)=>{
      const x=((seed.x+t*seed.drift+Math.sin(t*.7)*.09)%1+1)%1
      const y=((seed.y-t*seed.speed)%1+1)%1
      // Same real aperture/depth as the original room: ahead of dark panes,
      // behind wooden mullions. Depth testing occludes flakes at window framing;
      // depthWrite stays off so snow never punches holes in later transparency.
      positions.setXYZ(i,-4.145+x*1.20,1.04+y*1.90,-5.017)
    })
    positions.needsUpdate=true
  }
  diagnostic(){return{count:this.seeds.length,size:this.mesh.material.size,opacity:this.mesh.material.opacity,updateHz:24}}
  dispose():void{
    if(this.disposed)return
    this.disposed=true;this.mesh.removeFromParent()
    this.texture.dispose();this.mesh.geometry.dispose();this.mesh.material.dispose()
  }
}
