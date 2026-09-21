import { privateHostDestination } from './hostDestination'

const host=document.getElementById('host') as HTMLButtonElement
const join=document.getElementById('join') as HTMLButtonElement
const address=document.getElementById('address') as HTMLInputElement
const error=document.getElementById('destination-error')!
function mode(joining:boolean) {
  host.setAttribute('aria-pressed',String(!joining));join.setAttribute('aria-pressed',String(joining))
  document.getElementById('host-guide')!.hidden=joining
  document.getElementById('join-guide')!.hidden=!joining
  error.textContent='';address.removeAttribute('aria-invalid')
}
host.addEventListener('click',()=>mode(false));join.addEventListener('click',()=>mode(true))
document.getElementById('destination')!.addEventListener('submit',event=>{
  event.preventDefault()
  try {
    const target=privateHostDestination(address.value)
    // A deliberate top-level navigation gives the real host ownership of all
    // admission, credentials and poker actions. No cross-origin API access,
    // SDK bridge, token transfer or implicit creation/restart of a session.
    window.location.assign(target)
  } catch(reason) {
    error.textContent=reason instanceof Error?reason.message:'Invalid host URL.'
    address.setAttribute('aria-invalid','true');address.focus()
  }
})
