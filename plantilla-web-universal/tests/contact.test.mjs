import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequestPost} from '../functions/api/contact.js';
const makeRequest = (payload) => new Request('https://ejemplo.pages.dev/api/contact',{
  method:'POST',headers:{'Content-Type':'application/json','Origin':'https://ejemplo.pages.dev'},body:JSON.stringify(payload)
});
const valid = {name:'Ana',email:'ana@example.org',phone:'600000000',service:'Informacion general',message:'Quiero pedir informacion sobre sus servicios.',privacy:'accepted',turnstileToken:'token-demo',website:''};
const env = {CONTACT_ENABLED:'true',RESEND_API_KEY:'test-key',CONTACT_TO:'destinatario@example.org',MAIL_FROM:'Web <no-reply@example.org>',TURNSTILE_SECRET_KEY:'test-secret'};
test('Formulario sin secretos devuelve 503', async () => {
  const res=await onRequestPost({request:makeRequest(valid),env:{}});
  assert.equal(res.status,503);
});
test('Datos invalidos devuelven 400', async () => {
  const res=await onRequestPost({request:makeRequest({...valid,email:'no-es-email'}),env});
  assert.equal(res.status,400);
});
test('Proteccion antispam requerida', async () => {
  const res=await onRequestPost({request:makeRequest({...valid,turnstileToken:''}),env});
  assert.equal(res.status,400);
});
test('Formulario valido verifica Turnstile y prepara email', async (t) => {
  const original = globalThis.fetch;
  const called=[];
  globalThis.fetch = async (url, options) => {
    called.push({url:String(url),options});
    if (String(url).includes('siteverify')) return Response.json({success:true,hostname:'ejemplo.pages.dev'});
    if (String(url).includes('api.resend.com')) return Response.json({id:'fake-id'});
    throw Error('fetch inesperado');
  };
  t.after(()=>{globalThis.fetch=original;});
  const res=await onRequestPost({request:makeRequest(valid),env});
  assert.equal(res.status,200);
  assert.equal(called.length,2);
  const sent=JSON.parse(called[1].options.body);
  assert.equal(sent.reply_to,'ana@example.org');
});
test('Formulario desactivado rechaza peticion aunque existan secretos', async()=>{
 const res=await onRequestPost({request:makeRequest(valid),env:{...env,CONTACT_ENABLED:'false'}});assert.equal(res.status,503);
});
test('Origen externo rechazado',async()=>{
 const req=new Request('https://ejemplo.pages.dev/api/contact',{method:'POST',headers:{Origin:'https://otro.example','Content-Type':'application/json'},body:JSON.stringify(valid)});
 assert.equal((await onRequestPost({request:req,env})).status,403);
});
test('Limite real del cuerpo aunque no exista Content-Length',async()=>{
 assert.equal((await onRequestPost({request:makeRequest({...valid,message:'x'.repeat(9000)}),env})).status,413);
});
test('Honeypot no envia correo',async(t)=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>{throw Error('No debe llamarse')};t.after(()=>globalThis.fetch=original);
 assert.equal((await onRequestPost({request:makeRequest({...valid,website:'spam'}),env})).status,200);
});
for(const [name,verify,mailStatus,expected] of [['Token incorrecto',{success:false},200,400],['Hostname distinto',{success:true,hostname:'otro.example'},200,400],['Fallo correo',{success:true,hostname:'ejemplo.pages.dev'},500,502]]){
 test(name,async(t)=>{const original=globalThis.fetch;globalThis.fetch=async(url)=>String(url).includes('siteverify')?Response.json(verify):new Response('{}',{status:mailStatus});t.after(()=>globalThis.fetch=original);assert.equal((await onRequestPost({request:makeRequest(valid),env})).status,expected);});
}
