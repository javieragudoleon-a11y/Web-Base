import {spawnSync} from 'node:child_process';
const productionBranch=process.env.PRODUCTION_BRANCH||'main';
const isProd=process.env.CF_PAGES_BRANCH===productionBranch;
const mode=isProd?'--production':'--preview';
for(const [script,args] of [['scripts/build.mjs',[mode]],['scripts/check.mjs',[]]]){
 const result=spawnSync(process.execPath,[script,...args],{stdio:'inherit'});
 if(result.status!==0) process.exit(result.status||1);
}
