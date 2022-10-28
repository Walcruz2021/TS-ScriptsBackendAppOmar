const accentsMap: any = new Map([
  ['A', 'Á|À|Ã|Â|Ä'],
  ['a', 'á|à|ã|â|ä'],
  ['E', 'É|È|Ê|Ë'],
  ['e', 'é|è|ê|ë'],
  ['I', 'Í|Ì|Î|Ï'],
  ['i', 'í|ì|î|ï'],
  ['O', 'Ó|Ò|Ô|Õ|Ö'],
  ['o', 'ó|ò|ô|õ|ö'],
  ['U', 'Ú|Ù|Û|Ü'],
  ['u', 'ú|ù|û|ü']
  //['C', 'Ç'],
  //['c', 'ç'],
  //['N', 'Ñ'],
  //['n', 'ñ']
])

export const removeAccents = (text) =>
  [...accentsMap].reduce(
    (acc, [key]) => acc.replace(new RegExp(accentsMap.get(key), 'g'), key),
    text
  )
