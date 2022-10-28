import axios from 'axios'

import Env from '@ioc:Adonis/Core/Env'

export const sendLegacyFarmData = async (sliceIndex, farmsByTag) => {
  const dataToSend = farmsByTag.slice(sliceIndex, sliceIndex + 25)

  if (dataToSend.length === 0) {
    return
  }

  await axios.request({
    headers: {},
    method: 'PUT',
    url: `${Env.get('MS_FARM_URL')}/v1/farms/legacy/update`,
    data: dataToSend
  })

  return sendLegacyFarmData(sliceIndex + 25, farmsByTag)
}

export const legacyCasesMockData = {
  CASE_2: [
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      lotsIds: '5fa2c7d44f8bf708d1105940, 61fd333ad757e708efc47a0b',
      lotsNames: '100-Los Tulipanes-Tuli02, Tuli02- (0.35 ha)',
      Centroides: 'POINT(-57.52279916429563 -37.76039830461264)',
      Agrozona: 'SE',
      oldTags: 'Los Tulipanes, SE',
      newTag: 'Los Tulipanes'
    },
    {
      identifiers: '20314531060, 30709191310',
      companyName: 'Cazenave y Asociados Fiduciaria S.A., Ignacio Bravo',
      lotsIds: '613239119411277d271635cb, 61d71f9fd9f98068f5534d05',
      lotsNames: 'San German Casco - Boortmalt',
      Centroides: 'POINT(-59.07162520543597 -37.72813935720292)',
      Agrozona: 'SE',
      oldTags: 'San German, San German , San German.',
      newTag: 'San German'
    },
    {
      identifiers: 20050818021,
      companyName: 'Rojas Panelo Fernando Mario',
      lotsIds: '614c9092b28ab015c7201bc7, 6151c39fe1b1ef29b687223e',
      lotsNames: '2A',
      Centroides: 'POINT(-59.7990268468343 -37.14502401395706)',
      Agrozona: 'SE',
      oldTags: 'La Porfia, LA PORFIA',
      newTag: 'La Porfia'
    },
    {
      identifiers: '20314531060, 30709191310',
      companyName: 'Cazenave y Asociados Fiduciaria S.A., Ignacio Bravo',
      lotsIds: '613239119411277d271635c9, 61d71f9ed9f98068f5534d02',
      lotsNames: 'Loma Larga 5 - Boortmalt',
      Centroides: 'POINT(-59.77750033975202 -37.24772235267475)',
      Agrozona: 'SE',
      oldTags: 'Loma Larga, Loma Larga.',
      newTag: 'Loma Larga'
    },
    {
      identifiers: '20123412347, 20262526233, 20957896325',
      companyName: 'Agro Nomy, Empresa NICO PRODUCTORA, Rodrigo2022',
      lotsIds:
        '61fc03d1d757e708efc4351f, 620bbcd567548623af0b95ab, 62324485ffc9114a6214af65',
      lotsNames: 'Lote100has2',
      Centroides: 'POINT(-59.62753887125078 -36.0295723400644)',
      Agrozona: 'SE',
      oldTags: '123, TEST cocarda legacy, yopa',
      newTag: null
    },
    {
      identifiers: '20123412347, 20262526233, 20957896325',
      companyName: 'Agro Nomy, Empresa NICO PRODUCTORA, Rodrigo2022',
      lotsIds:
        '61fc03d1d757e708efc43520, 620bbcd567548623af0b95af, 62324485ffc9114a6214af69',
      lotsNames: 'lote2',
      Centroides: 'POINT(-59.61777394703425 -36.03349215685208)',
      Agrozona: 'SE',
      oldTags: '123, TEST cocarda legacy, yopa',
      newTag: null
    },
    {
      identifiers: '20123412347, 20262526233, 20957896325',
      companyName: 'Agro Nomy, Empresa NICO PRODUCTORA, Rodrigo2022',
      lotsIds:
        '61fc03d1d757e708efc43521, 620bbcd567548623af0b95b3, 62324485ffc9114a6214af6d',
      lotsNames: 'lote3',
      Centroides: 'POINT(-59.62230553155066 -36.03727760330722)',
      Agrozona: 'SE',
      oldTags: '123, TEST cocarda legacy, yopa',
      newTag: null
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6054129e83588636ea567f2e, 6054129e83588636ea567f39',
      lotsNames: 'Lote 14',
      Centroides: 'POINT(-61.64264958144279 -36.06232257002688)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Lejania, San Carlos',
      newTag: 'La Lejania '
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds:
        '603fca9889649d417e38774e, 603fccd289649d417e3877a6, 60f95ace69e74b791aba38a7',
      lotsNames: 'Luz Mala - 23',
      Centroides: 'POINT(-62.20271460979268 -35.9164980607484)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Luz Mala, Montenovo 21-22',
      newTag: 'Luz Mala'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fca9889649d417e38774d, 60f96ee269e74b791aba396e',
      lotsNames: 'Luz Mala - 18',
      Centroides: 'POINT(-62.18119366981302 -35.91445898096794)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Luz Mala, Montenovo 21/22',
      newTag: 'Luz Mala'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fca9889649d417e387743, 60f96ee269e74b791aba396c',
      lotsNames: 'Corral',
      Centroides: 'POINT(-62.19946914205826 -35.88199517173693)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Corral, Montenovo 21/22',
      newTag: 'Corral'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fca9889649d417e387749, 60f96ee269e74b791aba3971',
      lotsNames: 'La Laura - 09',
      Centroides: 'POINT(-62.20930123018108 -35.88298185401957)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Laura, Montenovo 21/22',
      newTag: 'La Laura'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fccd289649d417e3877a3, 60f96ee269e74b791aba3970',
      lotsNames: 'La Laura - 06',
      Centroides: 'POINT(-62.21113291699257 -35.87163957779363)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Laura, Montenovo 21/22',
      newTag: 'La Laura'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fca9889649d417e387744, 60f96ee269e74b791aba396f',
      lotsNames: 'La Casuarina - 38',
      Centroides: 'POINT(-62.16343993256753 -35.83595526296877)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Casuarina, Montenovo 21/22',
      newTag: 'La Casuarina'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fccd289649d417e3877a5, 60f9753269e74b791aba3ae3',
      lotsNames: 'La Laura - 17',
      Centroides: 'POINT(-62.15070544402234 -35.86488128524675)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Laura, Montenovo 21/22',
      newTag: 'La Laura'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fccd289649d417e38779d, 60f977e069e74b791aba3b3a',
      lotsNames: 'Daniel Lasca',
      Centroides: 'POINT(-62.18489785915113 -35.84464145836301)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Daniel Lasca, Montenovo 21/22',
      newTag: 'Daniel Lasca'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fca9889649d417e387745, 60f9753269e74b791aba3ae0',
      lotsNames: 'La Casuarina - 34',
      Centroides: 'POINT(-62.1660945011324 -35.84585031496631)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Casuarina, Montenovo 21/22',
      newTag: 'La Casuarina'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds:
        '603fca9889649d417e38774b, 603fccd289649d417e3877a4, 60f9753269e74b791aba3ae2',
      lotsNames: 'La Laura - 14',
      Centroides: 'POINT(-62.17597196430364 -35.8654488990406)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Laura, Montenovo 21/22',
      newTag: 'La Laura'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fccd289649d417e3877a2, 60f977e069e74b791aba3b40',
      lotsNames: 'La Laura - 02',
      Centroides: 'POINT(-62.1932875641883 -35.86114386184112)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Laura, Montenovo 21/22',
      newTag: 'La Laura'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fca9889649d417e38774a, 60f96ee269e74b791aba3972',
      lotsNames: 'La Laura - 12',
      Centroides: 'POINT(-62.19606015481812 -35.86607654767343)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Laura, Montenovo 21/22',
      newTag: 'La Laura'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fccd289649d417e3877a7, 60f977e069e74b791aba3b3b',
      lotsNames: 'Pastene',
      Centroides: 'POINT(-62.25451590771618 -35.84844935843583)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Montenovo 21/22, Pastene',
      newTag: 'Pastene'
    },
    {
      identifiers: 30552651282,
      companyName: 'JUAN EDUARDO SA',
      lotsIds: '605228d483588636ea567ccc, 619cd33bea0c476ddd68ff61',
      lotsNames: 'San Blas Lote 28, San Blas Lote 28',
      Centroides: 'POINT(-62.66594468116205 -35.89137707608641)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'San Blas, San Blas Gir',
      newTag: 'San Blas'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds: '603fccd289649d417e3877a0, 60f977e069e74b791aba3b3d',
      lotsNames: 'La Cotita - 26',
      Centroides: 'POINT(-62.32343764121755 -35.94519185178905)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Cotita, Montenovo 21/22',
      newTag: 'La Cotita'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds:
        '603fca9889649d417e387748, 603fccd289649d417e3877a1, 60f96ee269e74b791aba396d',
      lotsNames: 'La Cotita - 28',
      Centroides: 'POINT(-62.33274242376013 -35.93696601999395)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Cotita, Montenovo 21/22',
      newTag: 'La Cotita'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      lotsIds:
        '603fca9889649d417e387747, 603fccd289649d417e38779f, 60f977e069e74b791aba3b3c',
      lotsNames: 'La Cotita - 25',
      Centroides: 'POINT(-62.32438607155481 -35.93637412863394)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Cotita, Montenovo 21/22',
      newTag: 'La Cotita'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6054129e83588636ea567f24, 6054129e83588636ea567f38',
      lotsNames: 'Lote 1',
      Centroides: 'POINT(-61.83637952788025 -36.33840194118937)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Alfaland, San Carlos',
      newTag: 'Alfaland'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '60540eed83588636ea567edc, 60540eed83588636ea567ee1, 60540eed83588636ea567ee6',
      lotsNames: 'Feature1',
      Centroides: 'POINT(-61.43659028509883 -36.50885994535165)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Don Pancho, Los Platanos Norte, Rincon del Cinco',
      newTag: 'Don Pancho'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '60540eed83588636ea567edd, 60540eed83588636ea567ee2, 60540eed83588636ea567ee7',
      lotsNames: 'Feature1',
      Centroides: 'POINT(-61.45022490661284 -36.50044024898222)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Don Pancho, Los Platanos Norte, Rincon del Cinco',
      newTag: 'Don Pancho'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '60540eed83588636ea567ee0, 60540eed83588636ea567ee5, 60540eed83588636ea567eea',
      lotsNames: 'Feature1',
      Centroides: 'POINT(-61.459991510809 -36.45174163558175)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Don Pancho, Los Platanos Norte, Rincon del Cinco',
      newTag: 'Rincon del Cinco'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '60540eed83588636ea567edf, 60540eed83588636ea567ee4, 60540eed83588636ea567ee9',
      lotsNames: 'Feature1',
      Centroides: 'POINT(-61.46880392089464 -36.44269922980874)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Don Pancho, Los Platanos Norte, Rincon del Cinco',
      newTag: 'Rincon del Cinco'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '61fc394ad757e708efc44391, 626022f4c3b41671416df4c3',
      lotsNames: 'LA LARGA - LE 3, LE 3- (64.23 ha)',
      Centroides: 'POINT(-61.90533288967227 -36.77550055178258)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Eliza, La Larga',
      newTag: 'La Eliza'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '61fc3948d757e708efc4437c, 626022f4c3b41671416df4d7',
      lotsNames: 'LA LARGA - LQ 11, LQ 11- (75.88 ha)',
      Centroides: 'POINT(-61.85348183638105 -36.72744923696025)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Larga, La Quebrada',
      newTag: 'La Quebrada'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '61fc3949d757e708efc44389, 626022f4c3b41671416df4d3',
      lotsNames: 'LA LARGA - LLG TOROS, LLG TOROS- (30.62 ha)',
      Centroides: 'POINT(-61.92255973448351 -36.7321516582945)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Larga, La Larga Grande',
      newTag: 'La Larga Grande'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '60540eed83588636ea567ede, 60540eed83588636ea567ee3, 60540eed83588636ea567ee8',
      lotsNames: 'Feature1',
      Centroides: 'POINT(-62.20506448492516 -36.75171611131533)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Don Pancho, Los Platanos Norte, Rincon del Cinco',
      newTag: 'Los Platanos Norte'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '6053f9ae83588636ea567e37, 6053f9ae83588636ea567e49, 6053f9ae83588636ea567e52',
      lotsNames: 'Lote 2',
      Centroides: 'POINT(-63.6571147572412 -36.54210828955988)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Aguela, Las Mellizas, San Feliciano',
      newTag: 'San Feliciano'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '6053f9ae83588636ea567e23, 6053f9ae83588636ea567e38, 6053f9ae83588636ea567e54',
      lotsNames: 'Lote 4',
      Centroides: 'POINT(-63.65716883150791 -36.54906850399292)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Brambilla, La Aguela, San Feliciano',
      newTag: 'San Feliciano'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa591354f8bf708d1105aca, 61d73323d9f98068f5535203',
      lotsNames: 'Arr6, Arrieros 6',
      Centroides: 'POINT(-63.15090917013246 -36.48654841512565)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, Los Arrieros',
      newTag: 'Los Arrieros'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa591354f8bf708d1105ac6, 61d73323d9f98068f5535205',
      lotsNames: 'Arr 5-8, Arrieros 5-8',
      Centroides: 'POINT(-63.14326539240495 -36.48406453365923)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, Los Arrieros',
      newTag: 'Los Arrieros'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6053fdce83588636ea567ea2, 6053fdce83588636ea567ea6',
      lotsNames: 'Lote 8',
      Centroides: 'POINT(-63.32082047109836 -36.63407423551385)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Celina (Zamponi), San Javier',
      newTag: 'La Celina'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6053fdce83588636ea567ea1, 6053fdce83588636ea567ea5',
      lotsNames: 'Lote 1',
      Centroides: 'POINT(-63.32864687436049 -36.64046537858437)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Celina (Zamponi), San Javier',
      newTag: 'La Celina'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6053fdce83588636ea567ea4, 6053fdce83588636ea567ea9',
      lotsNames: 'Lote 8',
      Centroides: 'POINT(-63.15285238045291 -36.69413777368793)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Celina (Zamponi), San Javier',
      newTag: 'La Celina'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6053fdce83588636ea567ea3, 6053fdce83588636ea567ea7',
      lotsNames: 'Lote 1',
      Centroides: 'POINT(-63.161515175324 -36.70074831238044)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Celina (Zamponi), San Javier',
      newTag: 'La Celina'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c71, 613a0360369f9c21bb7ec273',
      lotsNames: 'EH 2a',
      Centroides: 'POINT(-63.12192949106192 -36.36223585153927)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, El Hornero',
      newTag: 'El Hornero'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c72, 613a0360369f9c21bb7ec277',
      lotsNames: 'EH 5a',
      Centroides: 'POINT(-63.13420502769199 -36.38421357503523)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, El Hornero',
      newTag: 'El Hornero'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c73, 613a0360369f9c21bb7ec278',
      lotsNames: 'EH 7a',
      Centroides: 'POINT(-63.14131166296268 -36.38963236202903)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, El Hornero',
      newTag: 'El Hornero'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c6c, 613a0360369f9c21bb7ec27b',
      lotsNames: 'EH 9',
      Centroides: 'POINT(-63.15007831958633 -36.39351316547595)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, El Hornero',
      newTag: 'El Hornero'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c6f, 613a0360369f9c21bb7ec27c',
      lotsNames: 'EH 15a',
      Centroides: 'POINT(-63.17371598822935 -36.41777966523262)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, El Hornero',
      newTag: 'El Hornero'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c6e, 6139e99e369f9c21bb7ebd1a',
      lotsNames: 'EH 13',
      Centroides: 'POINT(-63.16772284763451 -36.40729089503822)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, El Hornero',
      newTag: 'El Hornero'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa591354f8bf708d1105ac9, 61d73323d9f98068f5535207',
      lotsNames: 'Arr4, Arrieros 4',
      Centroides: 'POINT(-63.13984321526817 -36.47709795972982)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, Los Arrieros',
      newTag: 'Los Arrieros'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa591354f8bf708d1105ac7, 61d73323d9f98068f5535204',
      lotsNames: 'Arr3a, Arrieros 3a',
      Centroides: 'POINT(-63.14913677787192 -36.46933186568528)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, Los Arrieros',
      newTag: 'Los Arrieros'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa591354f8bf708d1105ac8, 61d73323d9f98068f5535206',
      lotsNames: 'Arr2, Arrieros 2',
      Centroides: 'POINT(-63.15367289621938 -36.47650280104411)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, Los Arrieros',
      newTag: 'Los Arrieros'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6054104b83588636ea567efd, 6054104b83588636ea567f00',
      lotsNames: 'Lote 6',
      Centroides: 'POINT(-63.51149889028838 -36.3085135383526)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Agradecida con Bilkura, La Emilia',
      newTag: 'La Agradecida'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771042c34c8f73e85b7617, 61f15f7d877ea70c503c9162',
      lotsNames: 'El 90 Lote 3',
      Centroides: 'POINT(-63.47036461839451 -36.12681746582467)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'El 90, El 90 tg',
      newTag: 'El 90'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771042c34c8f73e85b7618, 61f15f7d877ea70c503c9163',
      lotsNames: 'El 90 Lote 9',
      Centroides: 'POINT(-63.49328183462798 -36.12147418457976)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'El 90, El 90 tg',
      newTag: 'El 90'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771042c34c8f73e85b7616, 61f15f7d877ea70c503c9161',
      lotsNames: 'El 90 Lote 10B',
      Centroides: 'POINT(-63.47698807778128 -36.11343654821546)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'El 90, El 90 tg',
      newTag: 'El 90'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5bd72e353c20878e0b6aa, 61af6a9b85509a244824ec58',
      lotsNames: '3-4a EC, 4ab EC- (21.5 ha)',
      Centroides: 'POINT(-63.13452846756328 -36.15960852859283)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'El Clavo, PASA',
      newTag: 'El Clavo'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5a1ffe353c20878e0b624, 61af6a9b85509a244824ec59',
      lotsNames: '3-5ac EC, 5ac EC- (99.25 ha)',
      Centroides: 'POINT(-63.14574902670052 -36.16716528561367)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'El Clavo, PASA',
      newTag: 'El Clavo'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5a1ffe353c20878e0b623, 61af60a685509a244824e639',
      lotsNames: '2-6 EC, 6 EC- (136.2 ha)',
      Centroides: 'POINT(-63.15321012372088 -36.16086097398521)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'El Clavo, PASA',
      newTag: 'El Clavo'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5bd72e353c20878e0b6a9, 61af6a9b85509a244824ec5a',
      lotsNames: '2-5bc EC, 5bc EC- (36.51 ha)',
      Centroides: 'POINT(-63.1393950804549 -36.16941925868502)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'El Clavo, PASA',
      newTag: 'El Clavo'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5bd72e353c20878e0b6a7, 61af6a9b85509a244824ec57',
      lotsNames: '1-4b EC, 4ab EC- (18.9 ha)',
      Centroides: 'POINT(-63.13030198627749 -36.16274099259716)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'El Clavo, PASA',
      newTag: 'El Clavo'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa591354f8bf708d1105acd, 61d733a5d9f98068f55353cf',
      lotsNames: 'San Rafael 10b, SR10b',
      Centroides: 'POINT(-62.95248111821765 -36.19213078544035)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, San Rafael',
      newTag: 'San Rafael'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa591354f8bf708d1105acc, 61d733a5d9f98068f55353ce',
      lotsNames: 'San Rafael 10a, SR10a',
      Centroides: 'POINT(-62.95820721673081 -36.18875803623567)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, San Rafael',
      newTag: 'San Rafael'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5bd21e353c20878e0b696, 61af6a9d85509a244824ec70',
      lotsNames: '1-8 SH, 8 SH- (44.57 ha)',
      Centroides: 'POINT(-62.96618575545344 -36.18508371281084)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'PASA, San Hermenegildo',
      newTag: 'San Hermenigildo'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5a353e353c20878e0b64e, 61af646c85509a244824ea67',
      lotsNames: '1a2a SH-1- (180.82 ha), 7-1a/2a SH-1',
      Centroides: 'POINT(-62.99692992862872 -36.15072526533532)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'PASA, San Hermenegildo',
      newTag: 'San Hermenigildo'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa591354f8bf708d1105acb, 61d73324d9f98068f553520e',
      lotsNames: 'San Rafael 9b, SR9b',
      Centroides: 'POINT(-62.94459132020201 -36.18411183401508)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, San Rafael',
      newTag: 'San Rafael'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa591354f8bf708d1105ace, 61d73324d9f98068f553520f',
      lotsNames: 'San Rafael 11, SR11',
      Centroides: 'POINT(-62.93679846086125 -36.19050353490081)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Arias, San Rafael',
      newTag: 'San Rafael'
    },
    {
      identifiers: 30709919055,
      companyName: 'EDUARDO PEREDA Y HNAS AGROPECUARIA S.A.',
      lotsIds: '5fb599cee353c20878e0b5e5, 61af3f3285509a244824da42',
      lotsNames: '4-8M/8V/8b D-1, 8viuda8m8b D-1- (36.8 ha)',
      Centroides: 'POINT(-63.00193458487171 -36.04625637943635)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'EPH, Nueva Castilla',
      newTag: 'Nueva Castilla'
    },
    {
      identifiers: 30709919055,
      companyName: 'EDUARDO PEREDA Y HNAS AGROPECUARIA S.A.',
      lotsIds: '5fb59953e353c20878e0b5d8, 61af46b085509a244824dca0',
      lotsNames: '14-3d NC, 3d NC- (144.45 ha)',
      Centroides: 'POINT(-63.09578783073336 -36.0813515438062)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'EPH, Nueva Castilla',
      newTag: 'Nueva Castilla'
    },
    {
      identifiers: 30709919055,
      companyName: 'EDUARDO PEREDA Y HNAS AGROPECUARIA S.A.',
      lotsIds: '5fb59953e353c20878e0b5d2, 61af3f3285509a244824da3a',
      lotsNames: '2-1g NC-2- (5.16 ha), 8-2/1g NC-2',
      Centroides: 'POINT(-63.06470106925917 -36.06417183958873)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'EPH, Nueva Castilla',
      newTag: 'Nueva Castilla'
    },
    {
      identifiers: 30709919055,
      companyName: 'EDUARDO PEREDA Y HNAS AGROPECUARIA S.A.',
      lotsIds: '5fb599cee353c20878e0b5e6, 61af3f3285509a244824da44',
      lotsNames: '5-8M/8V/8b D-2, 8viuda8m8b D-3- (8.86 ha)',
      Centroides: 'POINT(-63.01058938654033 -36.05178335678582)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'EPH, Nueva Castilla',
      newTag: 'Nueva Castilla'
    },
    {
      identifiers: 30709919055,
      companyName: 'EDUARDO PEREDA Y HNAS AGROPECUARIA S.A.',
      lotsIds: '5fb5d380e353c20878e0b74b, 61af3f3285509a244824da35',
      lotsNames: '1-1/2-3-4 D, 1-4Loma D- (26.74 ha)',
      Centroides: 'POINT(-63.03161573695444 -36.03497408601401)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'EPH, Nueva Castilla',
      newTag: 'Nueva Castilla'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5a1ffe353c20878e0b626, 61af646b85509a244824ea5e',
      lotsNames: '4-5 SSD- (133.28 ha), 5-undefined',
      Centroides: 'POINT(-63.06569975512428 -36.00960525548953)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'PASA, Solo Sabe Dios',
      newTag: 'Solo Sabe Dios'
    },
    {
      identifiers: 30709919055,
      companyName: 'EDUARDO PEREDA Y HNAS AGROPECUARIA S.A.',
      lotsIds: '5fb599cee353c20878e0b5e4, 61af46b085509a244824dc9d',
      lotsNames: '12-14 AS- (96.38 ha), 3-12/14 AS',
      Centroides: 'POINT(-63.02996828573308 -36.01043269976276)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'EPH, Nueva Castilla',
      newTag: 'Nueva Castilla'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5bd72e353c20878e0b6a8, 61af6a9b85509a244824ec54',
      lotsNames: '1-undefined, Lomas SSD- (44.96 ha)',
      Centroides: 'POINT(-63.07168422237941 -36.00531574625488)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'PASA, Solo Sabe Dios',
      newTag: 'Solo Sabe Dios'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5bd21e353c20878e0b697, 61af6a9c85509a244824ec63',
      lotsNames: '1-9nc LE, 9nc LE- (68.46 ha)',
      Centroides: 'POINT(-62.92159255790932 -36.00173850011009)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Ester, PASA',
      newTag: 'Ester'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5a353e353c20878e0b648, 61af646c85509a244824ea64',
      lotsNames: '1-9s LE, 9s LE- (59.98 ha)',
      Centroides: 'POINT(-62.91436037054532 -36.006974593616)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Ester, PASA',
      newTag: 'Ester'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5bd21e353c20878e0b69a, 61af60a785509a244824e649',
      lotsNames: '1-3ns LE, 3ns LE- (112.19 ha)',
      Centroides: 'POINT(-62.87798959652597 -36.01333144163771)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Ester, PASA',
      newTag: 'Ester'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5bd21e353c20878e0b699, 61af60a785509a244824e647',
      lotsNames: '2-7ns LE, 7ns LE- (64.01 ha)',
      Centroides: 'POINT(-62.88598653337937 -36.00600772984392)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Ester, PASA',
      newTag: 'Ester'
    },
    {
      identifiers: 30508697909,
      companyName: 'Pereda Agro S.A-',
      lotsIds: '5fb5bd21e353c20878e0b698, 61af60a785509a244824e646',
      lotsNames: '1-7ns LE, 7ns LE- (23.33 ha)',
      Centroides: 'POINT(-62.89181535943038 -36.00123082404831)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Ester, PASA',
      newTag: 'Ester'
    },
    {
      identifiers: 30552651282,
      companyName: 'JUAN EDUARDO SA',
      lotsIds: '619cd33bea0c476ddd68ff64, 619cd600ea0c476ddd68ffe4',
      lotsNames: 'San Blas Lote 39-42',
      Centroides: 'POINT(-62.69427094854237 -35.86981533068099)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'San Blas, San Blas Gir',
      newTag: 'San Blas'
    },
    {
      identifiers: 30709919055,
      companyName: 'EDUARDO PEREDA Y HNAS AGROPECUARIA S.A.',
      lotsIds: '5fb598dde353c20878e0b5bb, 61af445a85509a244824db9c',
      lotsNames: '2-8/9 SM, 8-9 SM- (129.54 ha)',
      Centroides: 'POINT(-63.30278880511623 -35.88057773551924)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'EPH, San Martin',
      newTag: 'San Martin'
    },
    {
      identifiers: 30709919055,
      companyName: 'EDUARDO PEREDA Y HNAS AGROPECUARIA S.A.',
      lotsIds: '5fb598dde353c20878e0b5ba, 61af445a85509a244824db9b',
      lotsNames: '1-7 SM, 7 SM- (137.39 ha)',
      Centroides: 'POINT(-63.31092361485562 -35.88809992200602)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'EPH, San Martin',
      newTag: 'San Martin'
    },
    {
      identifiers: 30709919055,
      companyName: 'EDUARDO PEREDA Y HNAS AGROPECUARIA S.A.',
      lotsIds: '5fb598dde353c20878e0b5bf, 61af445a85509a244824dba1',
      lotsNames: '6-6/7 LM-1, 6-7 LM-1- (27.51 ha)',
      Centroides: 'POINT(-63.31654754136058 -35.9203614980548)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'EPH, La Marianita',
      newTag: 'La Marianita'
    },
    {
      identifiers: 30709919055,
      companyName: 'EDUARDO PEREDA Y HNAS AGROPECUARIA S.A.',
      lotsIds: '5fb598dde353c20878e0b5be, 61af472185509a244824dd97',
      lotsNames: '5-6 LM, 6 LM- (241.06 ha)',
      Centroides: 'POINT(-63.30431624344158 -35.93058438496529)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'EPH, La Marianita',
      newTag: 'La Marianita'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a1e4f8bf708d1105c36, 613024369411277d27160708',
      lotsNames: 'La Barranquita 9, LB 9',
      Centroides: 'POINT(-64.86038978672748 -33.08928409572014)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, La Barranquita',
      newTag: 'La Barranquita'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a1e4f8bf708d1105c35, 61d7409cd9f98068f5536023',
      lotsNames: 'La Barranquita 8, LB 8',
      Centroides: 'POINT(-64.86696032238729 -33.09601985064963)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, La Barranquita',
      newTag: 'La Barranquita'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a1e4f8bf708d1105c39, 613024359411277d27160703',
      lotsNames: 'CH 1',
      Centroides: 'POINT(-64.78538114030621 -33.07300472517364)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Chiclana, Ferrer',
      newTag: 'Chiclana'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a1e4f8bf708d1105c37, 613024359411277d27160702',
      lotsNames: 'CH 6',
      Centroides: 'POINT(-64.79217469888218 -33.07522613160292)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Chiclana, Ferrer',
      newTag: 'Chiclana'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a1e4f8bf708d1105c38, 613024359411277d27160701',
      lotsNames: 'CH 5',
      Centroides: 'POINT(-64.79004325386447 -33.0689440748532)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Chiclana, Ferrer',
      newTag: 'Chiclana'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      lotsIds: '5fa2c2ff4f8bf708d1105881, 61d87949d9f98068f5542fab',
      lotsNames: '50-Cuatro Vientos-CVI02, Cuatro Vientos CVI02(346.13)',
      Centroides: 'POINT(-64.58832613533383 -33.0546025380622)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'CBA, Cuatro Vientos',
      newTag: 'Cuatro Vientos'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a1e4f8bf708d1105c33, 61d7409cd9f98068f553601d',
      lotsNames: 'LP 15w',
      Centroides: 'POINT(-64.93075605025381 -33.23460594457026)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, La Pe√±a',
      newTag: 'La Peña'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a1e4f8bf708d1105c2f, 613024369411277d2716070b',
      lotsNames: 'LP 6',
      Centroides: 'POINT(-64.93802373823286 -33.20359641848618)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, La Pe√±a',
      newTag: 'La Peña'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a1e4f8bf708d1105c30, 61d7409cd9f98068f553601c',
      lotsNames: 'LP 8n',
      Centroides: 'POINT(-64.94646577722834 -33.20813444408817)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, La Pe√±a',
      newTag: 'La Peña'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a1e4f8bf708d1105c2e, 613024369411277d2716070d',
      lotsNames: 'LP2',
      Centroides: 'POINT(-64.95469696052199 -33.18458083899407)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, La Pe√±a',
      newTag: 'La Peña'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '6053f9ae83588636ea567e36, 6053f9ae83588636ea567e48, 6053f9ae83588636ea567e4e',
      lotsNames: 'Lote 2',
      Centroides: 'POINT(-65.54008508374322 -33.79361297688009)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'La Aguela, Las Mellizas, San Feliciano',
      newTag: 'Las Mellizas'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '6053f9ae83588636ea567e22, 6053f9ae83588636ea567e35, 6053f9ae83588636ea567e47',
      lotsNames: 'Lote 3',
      Centroides: 'POINT(-65.53944590261401 -33.78891820213759)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Brambilla, La Aguela, Las Mellizas',
      newTag: 'Las Mellizas'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      lotsIds: '5fa2c2ff4f8bf708d110588d, 61d87947d9f98068f5542f8d',
      lotsNames: '2-Don Angel-DAN1, Don Angel DAN1(22.58)',
      Centroides: 'POINT(-64.74229090727648 -33.65407235604905)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'CBA, Don Angel',
      newTag: 'Don Angel'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c61, 613a0361369f9c21bb7ec292',
      lotsNames: 'LM 45b, LMal 45b',
      Centroides: 'POINT(-64.97148072729661 -34.78682112589899)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Arias, La Malena',
      newTag: 'La Malena'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c60, 61388be9369f9c21bb7eacd9',
      lotsNames: 'LM 35b, LMal 35b',
      Centroides: 'POINT(-64.96894392118635 -34.77901028632012)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Arias, La Malena',
      newTag: 'La Malena'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c5f, 61388be9369f9c21bb7eacd8',
      lotsNames: 'LM 35a, LMal 35a',
      Centroides: 'POINT(-64.97422436737077 -34.77764491563327)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Arias, La Malena',
      newTag: 'La Malena'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c5e, 613a0361369f9c21bb7ec291',
      lotsNames: 'LM 23b, LMal 23b',
      Centroides: 'POINT(-64.99332265139184 -34.77053857023162)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Arias, La Malena',
      newTag: 'La Malena'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c5c, 613a0361369f9c21bb7ec28f',
      lotsNames: 'LM 23a1, LMal 23a1',
      Centroides: 'POINT(-64.99608474742621 -34.76556011272478)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Arias, La Malena',
      newTag: 'La Malena'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c5d, 613a0361369f9c21bb7ec290',
      lotsNames: 'LM 23a2, LMal 23a2',
      Centroides: 'POINT(-64.99121456834264 -34.76425771105515)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Arias, La Malena',
      newTag: 'La Malena'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c5b, 613a0361369f9c21bb7ec28e',
      lotsNames: 'LM 13, LMal 13',
      Centroides: 'POINT(-64.99253980829174 -34.75728942465788)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Arias, La Malena',
      newTag: 'La Malena'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c5a, 613a0361369f9c21bb7ec28d',
      lotsNames: 'LM 12, LMal 12',
      Centroides: 'POINT(-65.00448428706913 -34.75717851161715)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Arias, La Malena',
      newTag: 'La Malena'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59afd4f8bf708d1105c57, 613a0361369f9c21bb7ec28b',
      lotsNames: 'LM 5, LMal 5',
      Centroides: 'POINT(-64.97154518673049 -34.74765459520123)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Arias, La Malena',
      newTag: 'La Malena'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '6053f9ae83588636ea567e20, 6053f9ae83588636ea567e33, 6053f9ae83588636ea567e3d',
      lotsNames: 'Lote 5',
      Centroides: 'POINT(-65.34044035367297 -34.68301677462238)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Brambilla, La Aguela, La Maria Luisa',
      newTag: 'La Maria Luisa'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '6053f9ae83588636ea567e21, 6053f9ae83588636ea567e34, 6053f9ae83588636ea567e3f, 6053f9ae83588636ea567e4d',
      lotsNames: 'Lote 4',
      Centroides: 'POINT(-65.35456408920066 -34.68300426470725)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Brambilla, La Aguela, La Maria Luisa, San Feliciano',
      newTag: 'Gallinao'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a854f8bf708d1105c47, 61d6feabd9f98068f5534978',
      lotsNames: 'L1, SS1',
      Centroides: 'POINT(-64.63714129116831 -35.18755095698586)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Cueto, San Silvestre',
      newTag: 'San Silvestre'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a854f8bf708d1105c48, 61d6feabd9f98068f5534979',
      lotsNames: 'L2, SS2',
      Centroides: 'POINT(-64.64195617719126 -35.19514712669218)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Cueto, San Silvestre',
      newTag: 'San Silvestre'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a854f8bf708d1105c49, 61d6feabd9f98068f553497a',
      lotsNames: 'L3, SS3',
      Centroides: 'POINT(-64.6282774050689 -35.19495016350835)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Cueto, San Silvestre',
      newTag: 'San Silvestre'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a854f8bf708d1105c44, 617334b0c34c8f73e85b59ab',
      lotsNames: 'El Tala - Lote 14, ET 14',
      Centroides: 'POINT(-64.688189166106 -35.34448952059081)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Campo El Tala, Cueto',
      newTag: 'El Tala'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a854f8bf708d1105c43, 617334b0c34c8f73e85b59a9',
      lotsNames: 'El Tala - Lote 13, ET 13',
      Centroides: 'POINT(-64.70038809023463 -35.34431010782257)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Campo El Tala, Cueto',
      newTag: 'El Tala'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a854f8bf708d1105c45, 617334b0c34c8f73e85b59aa',
      lotsNames: 'El Tala - Lote 18, ET 18',
      Centroides: 'POINT(-64.70055030344955 -35.35315783059147)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Campo El Tala, Cueto',
      newTag: 'El Tala'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a854f8bf708d1105c46, 617334b0c34c8f73e85b59ac',
      lotsNames: 'El Tala - Lote 19, ET 19',
      Centroides: 'POINT(-64.68853764204565 -35.35320154249255)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Campo El Tala, Cueto',
      newTag: 'El Tala'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '60215b0ce59ea660a0bf6907, 60215b0de59ea660a0bf6911',
      lotsNames: 'Lote 3',
      Centroides: 'POINT(-63.80523098861929 -35.52635075471397)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Cumeco, La Perla',
      newTag: 'La Perla'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '60215b0ce59ea660a0bf6908, 60215b0de59ea660a0bf6913',
      lotsNames: 'Lote 3',
      Centroides: 'POINT(-63.69372656635789 -35.59755398587631)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Cumeco, La Perla',
      newTag: 'La Perla'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771043c34c8f73e85b7620, 61f15f7c877ea70c503c915b',
      lotsNames: 'La Esperanza L6',
      Centroides: 'POINT(-63.69936243675971 -35.8056716213469)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Esperanza, La Esperanza tg',
      newTag: 'La Esperanza'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771043c34c8f73e85b761f, 61f15f7c877ea70c503c915a',
      lotsNames: 'La Esperanza L4',
      Centroides: 'POINT(-63.69830417511192 -35.8006576899333)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Esperanza, La Esperanza tg',
      newTag: 'La Esperanza'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771043c34c8f73e85b761e, 61f15f7c877ea70c503c9159',
      lotsNames: 'La Esperanza L5',
      Centroides: 'POINT(-63.70286958588732 -35.80094283861429)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Esperanza, La Esperanza tg',
      newTag: 'La Esperanza'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771043c34c8f73e85b761d, 61f15f7c877ea70c503c9158',
      lotsNames: 'La Esperanza L3',
      Centroides: 'POINT(-63.70497225566249 -35.7950411208664)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Esperanza, La Esperanza tg',
      newTag: 'La Esperanza'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61770e15c34c8f73e85b7470, 61f15f7b877ea70c503c914b',
      lotsNames: 'La Via L2Loma',
      Centroides: 'POINT(-63.73274300260354 -35.72760191479072)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Via, La V√≠a',
      newTag: 'La Via'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771042c34c8f73e85b760a, 61f15f7b877ea70c503c9147',
      lotsNames: 'La Via L3',
      Centroides: 'POINT(-63.7215838346531 -35.72773933410502)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Via, La Via tg',
      newTag: 'La Via'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771042c34c8f73e85b760e, 61f15f7b877ea70c503c914c',
      lotsNames: 'La Via L2Bajo',
      Centroides: 'POINT(-63.72823950332729 -35.72821346748556)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Via, La Via tg',
      newTag: 'La Via'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771042c34c8f73e85b760d, 61f15f7b877ea70c503c914a',
      lotsNames: 'La Via L4',
      Centroides: 'POINT(-63.72937902763286 -35.73375424990312)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Via, La Via tg',
      newTag: 'La Via'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771042c34c8f73e85b760b, 61f15f7b877ea70c503c9148',
      lotsNames: 'La Via L5',
      Centroides: 'POINT(-63.72161876952423 -35.7330804815883)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Via, La Via tg',
      newTag: 'La Via'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771042c34c8f73e85b760c, 61f15f7b877ea70c503c9149',
      lotsNames: 'La Via L10',
      Centroides: 'POINT(-63.72543563107526 -35.74829585833152)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Via, La Via tg',
      newTag: 'La Via'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      lotsIds: '61771042c34c8f73e85b7609, 61f15f7b877ea70c503c9146',
      lotsNames: 'La Via L12',
      Centroides: 'POINT(-63.72313674094381 -35.75446702930433)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Via, La Via tg',
      newTag: 'La Via'
    },
    {
      identifiers: 30709919055,
      companyName: 'EDUARDO PEREDA Y HNAS AGROPECUARIA S.A.',
      lotsIds: '5fb598dde353c20878e0b5bc, 61af445a85509a244824dba6',
      lotsNames: '3-Pay, Pay 25-26-27- (248.76 ha)',
      Centroides: 'POINT(-63.24558836629174 -35.73261790284943)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'EPH, Paysandu',
      newTag: 'Paysandu'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105beb, 612d2cd920f92d1e7d0c280b',
      lotsNames: 'LV10',
      Centroides: 'POINT(-62.81061561850677 -35.45796981320277)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Elgue, La Vasca',
      newTag: 'La Vasca'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105be8, 612d2cd920f92d1e7d0c2808',
      lotsNames: 'LV4',
      Centroides: 'POINT(-62.79829843310982 -35.4697843622951)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Elgue, La Vasca',
      newTag: 'La Vasca'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105be9, 612d2cd920f92d1e7d0c2809',
      lotsNames: 'LV5',
      Centroides: 'POINT(-62.788798502228 -35.46628799807137)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Elgue, La Vasca',
      newTag: 'La Vasca'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bea, 612d2cd920f92d1e7d0c280a',
      lotsNames: 'LV6',
      Centroides: 'POINT(-62.78341759402434 -35.46158209025322)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Elgue, La Vasca',
      newTag: 'La Vasca'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6054104b83588636ea567eff, 6054104b83588636ea567f01',
      lotsNames: 'Lote 6',
      Centroides: 'POINT(-62.83642002339894 -35.39449317206669)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Agradecida con Bilkura, La Emilia',
      newTag: 'La Agradecida'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6054cb9d83588636ea567fec, 6054cb9d83588636ea567ff2',
      lotsNames: 'Lote 2',
      Centroides: 'POINT(-63.48535017140166 -35.25266323534881)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Campo Garcia, La Cruz',
      newTag: 'La Cruz'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6054cb9d83588636ea567feb, 6054cb9d83588636ea567ff1',
      lotsNames: 'Lote 1',
      Centroides: 'POINT(-63.49215423681579 -35.25264224886612)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Campo Garcia, La Cruz',
      newTag: 'La Cruz'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '60214796e59ea660a0bf684e, 60214796e59ea660a0bf6854',
      lotsNames: 'Lote 8',
      Centroides: 'POINT(-62.83746686367463 -35.21254242511698)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Santa Catalina, Santa Margarita',
      newTag: 'Santa Margarita'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bed, 6127f117fbde4b22ea049756',
      lotsNames: 'LM 1,2,3',
      Centroides: 'POINT(-63.11458406636226 -35.22759661503544)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, La Marianita',
      newTag: 'La Marianita '
    },
    {
      identifiers: 30507925665,
      companyName: 'Establecimiento Gallinao S. A.',
      lotsIds: '5fecc0a850fa43389bc2f699, 61d8c8b9d9f98068f55443d6',
      lotsNames: 'Gallinao 20',
      Centroides: 'POINT(-63.88436240509658 -34.94492638610055)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Establecimiento Gallinao, Gallinao',
      newTag: 'Gallinao'
    },
    {
      identifiers: 30507925665,
      companyName: 'Establecimiento Gallinao S. A.',
      lotsIds: '61116ead626d407457ecd65d, 61d75b6ed9f98068f5537460',
      lotsNames: 'Gallinao 5',
      Centroides: 'POINT(-63.92028523266737 -34.92443169889501)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'El Gallinao , Gallinao',
      newTag: 'Gallinao'
    },
    {
      identifiers: 30507925665,
      companyName: 'Establecimiento Gallinao S. A.',
      lotsIds: '5fecc0a850fa43389bc2f69e, 61d75b6ed9f98068f553745e',
      lotsNames: 'Gallinao 6',
      Centroides: 'POINT(-63.90285309746917 -34.92417938273901)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Establecimiento Gallinao, Gallinao',
      newTag: 'Gallinao'
    },
    {
      identifiers: 30507925665,
      companyName: 'Establecimiento Gallinao S. A.',
      lotsIds: '5fecc0a850fa43389bc2f69b, 61116c3a626d407457ecd5cf',
      lotsNames: 'Gallinao 28W',
      Centroides: 'POINT(-63.90675036157207 -34.95809309296029)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'El Gallinao, Establecimiento Gallinao',
      newTag: 'Gallinao'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a854f8bf708d1105c4d, 617334b2c34c8f73e85b59d8',
      lotsNames: 'ED 1b',
      Centroides: 'POINT(-63.79505957022955 -34.98583090027851)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Campo El Deslinde, Cueto',
      newTag: 'El Deslinde'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6053f9ae83588636ea567e1f, 6053f9ae83588636ea567e32',
      lotsNames: 'Lote 5',
      Centroides: 'POINT(-63.66807316486929 -35.11986793274431)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Brambilla, La Aguela',
      newTag: 'La Aguela'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '6053f9ae83588636ea567e1e, 6053f9ae83588636ea567e31, 6053f9ae83588636ea567e4c',
      lotsNames: 'Lote 4',
      Centroides: 'POINT(-63.65914299530393 -35.12089239523284)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Brambilla, La Aguela, San Feliciano',
      newTag: 'San Feliciano'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '6053f9ae83588636ea567e2f, 6053f9ae83588636ea567e44, 6053f9ae83588636ea567e4b',
      lotsNames: 'Lote 2',
      Centroides: 'POINT(-63.65798237941137 -35.12892792043179)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Aguela, Las Mellizas, San Feliciano',
      newTag: 'San Feliciano'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '6053f9ae83588636ea567e1d, 6053f9ae83588636ea567e30, 6053f9ae83588636ea567e45',
      lotsNames: 'Lote 3',
      Centroides: 'POINT(-63.65783071697577 -35.12572769081567)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Brambilla, La Aguela, Las Mellizas',
      newTag: 'Las Mellizas'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6054cb9d83588636ea567fea, 6054cb9d83588636ea567fef',
      lotsNames: 'Lote 2',
      Centroides: 'POINT(-63.64887854370973 -35.13386924985229)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Campo Garcia, La Cruz',
      newTag: 'La Cruz'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6054cb9d83588636ea567fe9, 6054cb9d83588636ea567fee',
      lotsNames: 'Lote 1',
      Centroides: 'POINT(-63.63778652154389 -35.13358742815855)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Campo Garcia, La Cruz',
      newTag: 'La Cruz'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6053f9ae83588636ea567e1b, 6053f9ae83588636ea567e2e',
      lotsNames: 'Lote 5',
      Centroides: 'POINT(-63.6053376635849 -35.12949747879815)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Brambilla, La Aguela',
      newTag: 'La Aguela'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '6053f9ae83588636ea567e1a, 6053f9ae83588636ea567e2d, 6053f9ae83588636ea567e4a',
      lotsNames: 'Lote 4',
      Centroides: 'POINT(-63.60509745449694 -35.12613158048786)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Brambilla, La Aguela, San Feliciano',
      newTag: 'San Feliciano'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds:
        '6053f9ae83588636ea567e19, 6053f9ae83588636ea567e2c, 6053f9ae83588636ea567e43',
      lotsNames: 'Lote 3',
      Centroides: 'POINT(-63.60498665242521 -35.12174879678476)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Brambilla, La Aguela, Las Mellizas',
      newTag: 'Las Mellizas'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '60215b0ce59ea660a0bf690e, 60215b0de59ea660a0bf6910',
      lotsNames: 1,
      Centroides: 'POINT(-63.88699161185721 -35.32293089868269)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Constancia, La Negra',
      newTag: 'La Negra'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '60215b0ce59ea660a0bf690d, 60215b0de59ea660a0bf690f',
      lotsNames: 1,
      Centroides: 'POINT(-63.91491500142283 -35.22263015444887)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Constancia, La Negra',
      newTag: 'La Negra'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a854f8bf708d1105c4c, 617334b1c34c8f73e85b59d3',
      lotsNames: 'EA 11',
      Centroides: 'POINT(-64.0146795968396 -35.25511935652338)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Campo El Amanecer, Cueto',
      newTag: 'El Amanecer'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a854f8bf708d1105c4b, 617334b1c34c8f73e85b59d2',
      lotsNames: 'EA 10',
      Centroides: 'POINT(-64.0205924853377 -35.25383285782585)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Campo El Amanecer, Cueto',
      newTag: 'El Amanecer'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a854f8bf708d1105c4a, 617334b1c34c8f73e85b59d1',
      lotsNames: 'EA 9',
      Centroides: 'POINT(-64.02738628817877 -35.25341882193464)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Campo El Amanecer, Cueto',
      newTag: 'El Amanecer'
    },
    {
      identifiers: 30507925665,
      companyName: 'Establecimiento Gallinao S. A.',
      lotsIds: '61116ead626d407457ecd65c, 61d75b6ed9f98068f553745f',
      lotsNames: 'Gallinao 1',
      Centroides: 'POINT(-63.92043193888064 -34.91397510992167)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'El Gallinao , Gallinao',
      newTag: 'Gallinao'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa590054f8bf708d1105ab0, 61d7396bd9f98068f55356fe',
      lotsNames: 'Salomone 3',
      Centroides: 'POINT(-64.02104979185479 -34.66772357312685)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, Salomone',
      newTag: 'Gallinao'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa590054f8bf708d1105aaf, 61d7396bd9f98068f55356fd',
      lotsNames: 'Salomone 1y2',
      Centroides: 'POINT(-64.01593635264489 -34.67140403242038)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, Salomone',
      newTag: 'Salomone'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '60214796e59ea660a0bf684c, 60214796e59ea660a0bf684f',
      lotsNames: 'Lote 8',
      Centroides: 'POINT(-63.23065080427913 -34.4789523434502)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Santa Catalina, Santa Margarita',
      newTag: 'Santa Margarita'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bf0, 61293b0b20f92d1e7d0c0f25',
      lotsNames: 'LB 13',
      Centroides: 'POINT(-62.75401682176258 -34.73776904454012)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, Los Baguales',
      newTag: 'Los Baguales'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bf1, 612d2cda20f92d1e7d0c282a',
      lotsNames: 'LB 4',
      Centroides: 'POINT(-62.75069464728819 -34.74519783464084)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, Los Baguales',
      newTag: 'Los Baguales'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bf2, 612d2cda20f92d1e7d0c282b',
      lotsNames: 'LB 3N 3S',
      Centroides: 'POINT(-62.73124753623873 -34.75864050641915)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, Los Baguales',
      newTag: 'Los Baguales'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa321ee4f8bf708d11059f9, 612d2cda20f92d1e7d0c282c',
      lotsNames: 'LB 2N 2S',
      Centroides: 'POINT(-62.7415144316569 -34.75898377231938)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Los Baguales, Los Baguales',
      newTag: 'Los Baguales'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105be1, 612d2cda20f92d1e7d0c281b',
      lotsNames: 'SA 5n',
      Centroides: 'POINT(-62.34635788200875 -34.49174654975506)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, San Alberto',
      newTag: 'San Alberto'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bdd, 612d2cda20f92d1e7d0c281d',
      lotsNames: 'SA 2s',
      Centroides: 'POINT(-62.35829743843807 -34.49423266470277)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, San Alberto',
      newTag: 'San Alberto'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bdf, 612d2cda20f92d1e7d0c281a',
      lotsNames: 'SA 3a',
      Centroides: 'POINT(-62.35799685853733 -34.4825180903982)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, San Alberto',
      newTag: 'San Alberto'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bde, 6127fa66fbde4b22ea049881',
      lotsNames: 'SA 1',
      Centroides: 'POINT(-62.36700153638704 -34.48932791256026)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, San Alberto',
      newTag: 'San Alberto'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105be5, 612d2cda20f92d1e7d0c2821',
      lotsNames: 'SA 8a',
      Centroides: 'POINT(-62.37350007682437 -34.50226653723792)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, San Alberto',
      newTag: 'San Alberto'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105be6, 612d2cda20f92d1e7d0c281c',
      lotsNames: 'SA 8b',
      Centroides: 'POINT(-62.37160378627352 -34.4967188736789)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, San Alberto',
      newTag: 'San Alberto'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105be3, 612d2cda20f92d1e7d0c2820',
      lotsNames: 'SA 6s',
      Centroides: 'POINT(-62.35009797274672 -34.50474382281041)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, San Alberto',
      newTag: 'San Alberto'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105be2, 612d2cda20f92d1e7d0c281f',
      lotsNames: 'SA 5s',
      Centroides: 'POINT(-62.3476985755552 -34.49608064528917)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, San Alberto',
      newTag: 'San Alberto'
    },
    {
      identifiers: 30558314539,
      companyName: 'TILO PAMPA SA',
      lotsIds: '6216b1f12c54e41c6c1fcf6b, 621923200f443753b770491c',
      lotsNames: '23, La Esperanza-23- (128.03 ha)',
      Centroides: 'POINT(-62.15627188854886 -34.13402831762403)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Esperanza, La Esperanza',
      newTag: 'Esperanza'
    },
    {
      identifiers: 30558314539,
      companyName: 'TILO PAMPA SA',
      lotsIds: '621923200f443753b77048f8, 621923220f443753b770494e',
      lotsNames: '01, Lambare-1- (44.73 ha)',
      Centroides: 'POINT(-62.16790382484975 -34.10651093834373)',
      Agrozona: 'NBA-SSF',
      oldTags: 'La Esperanza, Lambare',
      newTag: 'Esperanza'
    },
    {
      identifiers: 30558314539,
      companyName: 'TILO PAMPA SA',
      lotsIds: '6216b1f12c54e41c6c1fcf6f, 621923200f443753b7704928',
      lotsNames: '27, La Esperanza-27- (88.31 ha)',
      Centroides: 'POINT(-62.16105903055528 -34.11981950322584)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Esperanza, La Esperanza',
      newTag: 'Esperanza'
    },
    {
      identifiers: 30558314539,
      companyName: 'TILO PAMPA SA',
      lotsIds: '6216b1f12c54e41c6c1fcf63, 621923200f443753b7704904',
      lotsNames: '12, La Esperanza-12- (66.32 ha)',
      Centroides: 'POINT(-62.11575573685503 -34.11156903391412)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Esperanza, La Esperanza',
      newTag: 'Esperanza'
    },
    {
      identifiers: 30558314539,
      companyName: 'TILO PAMPA SA',
      lotsIds: '62101d75c0c9d94ad1eaa8a4, 6216b1f12c54e41c6c1fcf5f',
      lotsNames: 'La Esperanza-11L- (34.07 ha)',
      Centroides: 'POINT(-62.10904364545272 -34.10534052799776)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Esperanza, La Esperanza',
      newTag: 'Esperanza'
    },
    {
      identifiers: 30558314539,
      companyName: 'TILO PAMPA SA',
      lotsIds: '62101d76c0c9d94ad1eaa8a8, 6216b1f12c54e41c6c1fcf67',
      lotsNames: 'La Esperanza-14L- (28.66 ha)',
      Centroides: 'POINT(-62.10795430532679 -34.12511428330285)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Esperanza, La Esperanza',
      newTag: 'Esperanza'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bfa, 6176ed01c34c8f73e85b72bf',
      lotsNames: 'SC 5 chico Sur',
      Centroides: 'POINT(-61.66326311220072 -34.77943909721172)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, Santa Catalinaa',
      newTag: 'Santa Catalina'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bf9, 6127fa65fbde4b22ea04987a',
      lotsNames: 'SC 4 Norte',
      Centroides: 'POINT(-61.64813933889986 -34.77905708606675)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, Santa Catalina',
      newTag: 'Santa Catalina'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bdc, 6127f118fbde4b22ea04977c',
      lotsNames: 'Estancia Vieja, SM Estancia Vieja',
      Centroides: 'POINT(-61.44702503016809 -35.20823135517221)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Elgue, Santa Maria, Santa Maria',
      newTag: 'Santa Maria'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bdb, 61293b0c20f92d1e7d0c0f37',
      lotsNames: 'SM 24',
      Centroides: 'POINT(-61.46854218637937 -35.24263476049887)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Elgue, Santa Maria',
      newTag: 'Santa Maria'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bd8, 61293b0c20f92d1e7d0c0f36',
      lotsNames: 'SM 29',
      Centroides: 'POINT(-61.45060035566051 -35.23467467726077)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Elgue, Santa Maria',
      newTag: 'Santa Maria'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bda, 6127f118fbde4b22ea04977b',
      lotsNames: 'SM PISTA',
      Centroides: 'POINT(-61.4421546045549 -35.24137977309768)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Elgue, Santa Maria, Santa Maria',
      newTag: 'Santa Maria'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bd9, 6127f118fbde4b22ea04977a',
      lotsNames: 'SM 38',
      Centroides: 'POINT(-61.43362759060805 -35.23774277333122)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Elgue, Santa Maria, Santa Maria',
      newTag: 'Santa Maria'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bf3, 61293b0c20f92d1e7d0c0f31',
      lotsNames: 'LA 5',
      Centroides: 'POINT(-62.65530458832593 -35.12367725990324)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, La Alejandrina',
      newTag: 'La Alejandrina'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bf6, 6176ed00c34c8f73e85b72ac',
      lotsNames: 'LA 10 11',
      Centroides: 'POINT(-62.65633258751729 -35.13130260132134)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, La Alejandrinaa',
      newTag: 'La Alejandrina'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa598e44f8bf708d1105bf8, 61293b0c20f92d1e7d0c0f2e',
      lotsNames: 'LA 27',
      Centroides: 'POINT(-62.6598591172293 -35.14707517956514)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Elgue, La Alejandrina',
      newTag: 'La Alejandrina'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6054129e83588636ea567f29, 6054129e83588636ea567f3c',
      lotsNames: 'Lote 1',
      Centroides: 'POINT(-62.13410375669717 -35.51470616020986)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'Alfaland, San Carlos',
      newTag: 'San Carlos'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '6054129e83588636ea567f2f, 6054129e83588636ea567f3a',
      lotsNames: 'Lote 14',
      Centroides: 'POINT(-62.11447687177352 -35.49640022288809)',
      Agrozona: 'OBA - La Pampa',
      oldTags: 'La Lejania, San Carlos',
      newTag: 'San Carlos'
    },
    {
      identifiers: 27005670409,
      companyName: 'Alfonso Company',
      lotsIds: '6121138bfbde4b22ea04446c, 619ff8b37747761387391420',
      lotsNames: 'Zona Hurlingham',
      Centroides: 'POINT(-58.64979976838701 -34.59831308212349)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Establecimiento 1, prueba alfonso',
      newTag: null
    },
    {
      identifiers: '27389632541, 30520688672',
      companyName: 'Gonzales S., Siembra Maiz',
      lotsIds: '602eaa83bedcf524bffb33f2, 606c9a42240ba3122bd0a060',
      lotsNames: 'Lote1',
      Centroides: 'POINT(-58.58657805604921 -34.5839270389271)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Corona, prodMaiz',
      newTag: 'Corona'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa599464f8bf708d1105c12, 6127dff9fbde4b22ea049468',
      lotsNames: 'Cura Malal 12',
      Centroides: 'POINT(-60.13820705125253 -34.08219813699986)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Cosentino, Cura Malal',
      newTag: 'Cura Malal'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa599464f8bf708d1105c11, 6127dff9fbde4b22ea049467',
      lotsNames: 'Cura Malal 11',
      Centroides: 'POINT(-60.13328233043425 -34.07700394392183)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Cosentino, Cura Malal',
      newTag: 'Cura Malal'
    },
    {
      identifiers: 30710712758,
      companyName: 'AGRONASAJA SRL',
      lotsIds:
        '6235df2e0fbbda3125a71bfa, 62386b2543b4d206e8232d81, 62386bcb43b4d206e823305b, 62386c5f43b4d206e8233317',
      lotsNames: 'Rasuk ensayos, Rasuk_ensayos, Rasuk - Ensayos',
      Centroides: 'POINT(-60.62772408555344 -33.94841119503103)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Rasuk, Rasuk ensayos',
      newTag: 'Rasuk '
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa599464f8bf708d1105c0b, 6148fc13b28ab015c72003be',
      lotsNames: 'El Refugio 18 W',
      Centroides: 'POINT(-60.87554111446703 -33.72337651222303)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Cosentino, El Rufugio',
      newTag: 'El Refugio'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa599464f8bf708d1105c0d, 6148fc13b28ab015c72003c0',
      lotsNames: 'El Refugio 17 E',
      Centroides: 'POINT(-60.87313044163317 -33.71480751930149)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Cosentino, El Rufugio',
      newTag: 'El Refugio'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa599464f8bf708d1105c0c, 6148fc13b28ab015c72003bf',
      lotsNames: 'El Refugio 18 E',
      Centroides: 'POINT(-60.8690528853393 -33.71805452142351)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Cosentino, El Rufugio',
      newTag: 'El Refugio'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa599464f8bf708d1105c05, 6148fc13b28ab015c72003c3',
      lotsNames: 'El Refugio 12 B',
      Centroides: 'POINT(-60.86549955034459 -33.69644225685785)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Cosentino, El Rufugio',
      newTag: 'El Refugio'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa599464f8bf708d1105c04, 6148fc13b28ab015c72003c2',
      lotsNames: 'El Refugio 13 A',
      Centroides: 'POINT(-60.85736232998097 -33.69806666544137)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Cosentino, El Rufugio',
      newTag: 'El Refugio'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa599464f8bf708d1105c06, 6148fc13b28ab015c72003c4',
      lotsNames: 'El Refugio 12 A',
      Centroides: 'POINT(-60.86221560375176 -33.69335347809895)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Cosentino, El Rufugio',
      newTag: 'El Refugio'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa599464f8bf708d1105c07, 6148fc13b28ab015c72003c5',
      lotsNames: 'El Refugio 1 A',
      Centroides: 'POINT(-60.86877809561607 -33.6887779900829)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Cosentino, El Rufugio',
      newTag: 'El Refugio'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '605415ee83588636ea567f74, 605415ee83588636ea567f7e',
      lotsNames: 'Lote 2',
      Centroides: 'POINT(-58.19367697612795 -33.19168901221045)',
      Agrozona: 'Entre Rios',
      oldTags: 'La Amelita, Rivollier',
      newTag: 'La Amelita '
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '605415ee83588636ea567f6f, 605415ee83588636ea567f7d',
      lotsNames: 'Lote 2',
      Centroides: 'POINT(-58.65703100478848 -33.29390629590289)',
      Agrozona: 'Entre Rios',
      oldTags: 'La Amelita, Rivollier',
      newTag: 'La Amelita '
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '6061f9bd1a599f5774d9a6f5, 6061fac81a599f5774d9a70e',
      lotsNames: 'Lote 2',
      Centroides: 'POINT(-58.69889576182914 -33.3003117626143)',
      Agrozona: 'Entre Rios',
      oldTags: 'La China, La Marita',
      newTag: 'La China'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '605415ee83588636ea567f6e, 605415ee83588636ea567f7c',
      lotsNames: 'Lote 1',
      Centroides: 'POINT(-58.66365483490465 -33.28748159389521)',
      Agrozona: 'Entre Rios',
      oldTags: 'La Amelita, Rivollier',
      newTag: 'La Amelita'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '6061f9bd1a599f5774d9a6f4, 6061fac81a599f5774d9a716',
      lotsNames: 2,
      Centroides: 'POINT(-58.65803397933514 -33.27438994713703)',
      Agrozona: 'Entre Rios',
      oldTags: 'El Nazareno, San Juan',
      newTag: 'San Juan'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '605415ee83588636ea567f76, 605415ee83588636ea567f80',
      lotsNames: 'Lote 2',
      Centroides: 'POINT(-58.66277595311082 -33.26028240790576)',
      Agrozona: 'Entre Rios',
      oldTags: 'La Amelita, Rivollier',
      newTag: 'La Amelita '
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      lotsIds: '605415ee83588636ea567f75, 605415ee83588636ea567f7f',
      lotsNames: 'Lote 1',
      Centroides: 'POINT(-58.65452397126918 -33.2595772425394)',
      Agrozona: 'Entre Rios',
      oldTags: 'La Amelita, Rivollier',
      newTag: 'La Amelita'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '6061f9bd1a599f5774d9a6f3, 6061fac81a599f5774d9a710',
      lotsNames: 2,
      Centroides: 'POINT(-58.66140191339328 -33.23017121305244)',
      Agrozona: 'Entre Rios',
      oldTags: 'El Nazareno, San Juan',
      newTag: 'El Nazareno '
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '6061fcf41a599f5774d9a756, 6061fdcc1a599f5774d9a78e',
      lotsNames: 1,
      Centroides: 'POINT(-58.91074634471941 -33.06330885876656)',
      Agrozona: 'Entre Rios',
      oldTags: 'La Elda, La Pilarica',
      newTag: 'La Elda'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '6061fc0f1a599f5774d9a73a, 60f5d88069e74b791ab9e476',
      lotsNames: 'Campo El Chana I Lote 2, Campo El Chana-Lote 2',
      Centroides: 'POINT(-58.61207440826169 -32.85452418319205)',
      Agrozona: 'Entre Rios',
      oldTags: 'El Chan√°, El Chana I',
      newTag: 'El Chana'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '60fecbd6dd60904e40a1c376, 61fc4a73d757e708efc448db',
      lotsNames: 'Lote 4',
      Centroides: 'POINT(-58.68661163987554 -32.66667771943089)',
      Agrozona: 'Entre Rios',
      oldTags: 'Arbolito, El Arbolito',
      newTag: 'El Arbolito'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '60f5d88069e74b791ab9e472, 61e816e04387a2091bd74171',
      lotsNames: '3, La Rosita- Lote3',
      Centroides: 'POINT(-58.85393631787824 -32.59610991598942)',
      Agrozona: 'Entre Rios',
      oldTags: 'La Rosita, La Rosita...',
      newTag: 'La Rosita'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '60e09243faa0375798b31539, 60e38180faa0375798b34423',
      lotsNames: 'La Soledad de Juan-Lote 3, La SoleII Juan-Lote 3',
      Centroides: 'POINT(-58.8202950710519 -32.2707151190243)',
      Agrozona: 'Entre Rios',
      oldTags: 'La Soledad de Juan, La Soledad II de Juan',
      newTag: 'La Soledad de Juan '
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '60e094acfaa0375798b3170e, 6126b745fbde4b22ea047157',
      lotsNames: 'El Sauce Nogoya.Lote 13.',
      Centroides: 'POINT(-59.67405890131326 -32.39836846484144)',
      Agrozona: 'Entre Rios',
      oldTags: 'Sauce Nogoya, Sauce Nogoya',
      newTag: 'Sauce Nogoya'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '60e4555ffaa0375798b362ba, 611d8195fbde4b22ea0412c4',
      lotsNames: 'Las Araucarias-Lote 1, Lote 1',
      Centroides: 'POINT(-59.85148217327927 -32.55562627467667)',
      Agrozona: 'Entre Rios',
      oldTags: 'Araucarias, Las Araucarias',
      newTag: 'Las Araucarias'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds:
        '60609fec1a599f5774d9a387, 60609fec1a599f5774d9a38f, 6060a0961a599f5774d9a3a2, 6060a0961a599f5774d9a3aa, 6061d2651a599f5774d9a423',
      lotsNames: 4,
      Centroides: 'POINT(-59.1498914819549 -32.59567799177535)',
      Agrozona: 'Entre Rios',
      oldTags: 'La Edelmira, San Carlos',
      newTag: 'San Carlos '
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds:
        '60609fec1a599f5774d9a385, 60609fec1a599f5774d9a38e, 6060a0961a599f5774d9a3a0, 6060a0961a599f5774d9a3a9, 606146161a599f5774d9a3bc, 6061d2651a599f5774d9a419',
      lotsNames: 4,
      Centroides: 'POINT(-59.17369692455526 -32.59287861567789)',
      Agrozona: 'Entre Rios',
      oldTags: 'La Edelmira, San Carlos',
      newTag: 'La Edelmira'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds:
        '60609fec1a599f5774d9a38d, 6060a0961a599f5774d9a3a8, 6061d2651a599f5774d9a421',
      lotsNames: 'Lote Largo II',
      Centroides: 'POINT(-59.15391061403102 -32.68400291305549)',
      Agrozona: 'Entre Rios',
      oldTags: 'La Tenaza, La Tenza',
      newTag: 'La Tenaza'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '60df4a21faa0375798b3091b, 611d8194fbde4b22ea0412c2',
      lotsNames: 'Lote 2, San Pedr. Lag Pescador-Lote 2',
      Centroides: 'POINT(-59.96951330809858 -32.75282552828732)',
      Agrozona: 'Entre Rios',
      oldTags: 'San Pedro Laguna Pescador, San Pedro Laguna Pescador',
      newTag: 'San Pedro Laguna Pescador'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '60e3191bfaa0375798b33470, 60e5b29b37a9a62bae0a251b',
      lotsNames: 'Lote 3, SPLdP-Lote 3',
      Centroides: 'POINT(-59.97505221590962 -32.73192099226205)',
      Agrozona: 'Entre Rios',
      oldTags: 'San Pedro Laguna del Pescado, San Pedro Laguna del Pescador',
      newTag: 'San Pedro Laguna Pescador'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa599464f8bf708d1105c09, 6148fc13b28ab015c72003bc',
      lotsNames: 'El Refugio 8S',
      Centroides: 'POINT(-60.88338759443175 -33.71812456367681)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Cosentino, El Rufugio',
      newTag: 'El Refugio'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa599464f8bf708d1105c0a, 6148fc13b28ab015c72003bd',
      lotsNames: 'El Refugio 17 W',
      Centroides: 'POINT(-60.87922309337818 -33.7202766457996)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Cosentino, El Rufugio',
      newTag: 'El Refugio'
    },
    {
      identifiers: 30558314539,
      companyName: 'TILO PAMPA SA',
      lotsIds: '6217fe819bb2b40fdcc04dcf, 62308424d8184144aa1e1426',
      lotsNames: 'San Alfredo - Lote 42',
      Centroides: 'POINT(-61.45061802706662 -33.86124518289587)',
      Agrozona: 'NBA-SSF',
      oldTags: 'San Alfredo, San Alfredo 39 y 42',
      newTag: 'San Alfredo'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      lotsIds: '61130e1d626d407457ed141e, 61d86a10d9f98068f553ff3a',
      lotsNames: 'Las Pampas LPAM10E(176.33)',
      Centroides: 'POINT(-63.55112555743476 -33.48172446529077)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Las Pampas, Pampas',
      newTag: 'Salomone'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      lotsIds: '61130e1d626d407457ed141c, 61d86a10d9f98068f553ff38',
      lotsNames: 'Las Pampas LPAM4N(88.08)',
      Centroides: 'POINT(-63.51510908776944 -33.50200017301164)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Las Pampas, Pampas',
      newTag: 'Las Pampas'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      lotsIds: '61d864e9d9f98068f553f201, 61d86cb1d9f98068f55405f7',
      lotsNames: 'Las Pampas LPAM8N(113.75)',
      Centroides: 'POINT(-63.5468428622032 -33.49969290990393)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Las Pampas, Pampas',
      newTag: 'Las Pampas'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      lotsIds: '61130e1d626d407457ed141d, 61d86a10d9f98068f553ff39',
      lotsNames: 'Las Pampas LPAM8S(125.7)',
      Centroides: 'POINT(-63.55069527771801 -33.50863459918829)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Las Pampas, Pampas',
      newTag: 'Las Pampas'
    },
    {
      identifiers: '30511355040, 30709191310',
      companyName:
        'Cazenave y Asociados Fiduciaria S.A., SUCESION DE ANTONIO MORENO S A C A I F E I',
      lotsIds: '5fa59a1e4f8bf708d1105c34, 61d7409dd9f98068f5536026',
      lotsNames: 'La Brianza n, LB n',
      Centroides: 'POINT(-64.11020875373258 -33.4203429113937)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Brianza, Ferrer',
      newTag: 'Brianza'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa590054f8bf708d1105aad, 61d73969d9f98068f55356eb',
      lotsNames: 'Mis Padres Varios',
      Centroides: 'POINT(-64.44408849942026 -33.09501843053551)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, Mis Padres',
      newTag: 'Mis Padres'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa590054f8bf708d1105aaa, 613008809411277d2715fc4a',
      lotsNames: 'La Rubia 3',
      Centroides: 'POINT(-64.45728723775358 -32.80813264643095)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, La Rubia',
      newTag: 'La Rubia'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa590054f8bf708d1105aa9, 613008809411277d2715fc49',
      lotsNames: 'La Rubia 5',
      Centroides: 'POINT(-64.45213909695097 -32.80327077100188)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, La Rubia',
      newTag: 'La Rubia'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      lotsIds: '5fa590054f8bf708d1105aab, 613008809411277d2715fc4b',
      lotsNames: 'La Rubia 6',
      Centroides: 'POINT(-64.45200243837185 -32.80943941844076)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Ferrer, La Rubia',
      newTag: 'La Rubia'
    },
    {
      identifiers: 30708166479,
      companyName: 'HIJOS DE LORENZO BRUNOTTO S.A.',
      lotsIds: '612ede149411277d2715e226, 613242189411277d2716361c',
      lotsNames:
        'Poz del Avestruz - Lote 4 loma, Poz del Avestruz - Lote 4 loma',
      Centroides: 'POINT(-62.88644650570964 -31.61604638889921)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Campo Pozo del Avestruz, Campo Pozo del Avestruz',
      newTag: 'Pozo del Avestruz'
    },
    {
      identifiers: 30708166479,
      companyName: 'HIJOS DE LORENZO BRUNOTTO S.A.',
      lotsIds: '612ede149411277d2715e227, 613242189411277d2716361e',
      lotsNames: 'Pozo del Avestruz - lote 2a, Pozo del Avestruz - lote 2a',
      Centroides: 'POINT(-62.87800212106331 -31.61215115381066)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Campo Pozo del Avestruz, Campo Pozo del Avestruz',
      newTag: 'Pozo del Avestruz'
    },
    {
      identifiers: 30708166479,
      companyName: 'HIJOS DE LORENZO BRUNOTTO S.A.',
      lotsIds: '612edeaf9411277d2715e25c, 613242189411277d2716361d',
      lotsNames: 'Pozo del Avestruz - Lote 1a',
      Centroides: 'POINT(-62.88978220490492 -31.61023421394941)',
      Agrozona: 'Cordoba - San Luis',
      oldTags: 'Campo Pozo del Avestruz, Campo Pozo del Avestruz',
      newTag: 'Pozo del Avestruz'
    },
    {
      identifiers: 20255206649,
      companyName: 'TSCHIEDER IVAN EDUARDO',
      lotsIds: '61ba241909658c5edd22191c, 61ba255409658c5edd221942',
      lotsNames: 'Crosa 22',
      Centroides: 'POINT(-61.19446755532299 -31.34712761877152)',
      Agrozona: 'NBA-SSF',
      oldTags: 'Crosa 22, Crossa',
      newTag: 'Crossa'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      lotsIds: '6061f7d01a599f5774d9a6cc, 6061f88e1a599f5774d9a6e6',
      lotsNames: 'Lote 1',
      Centroides: 'POINT(-59.16074582025694 -32.15581042103741)',
      Agrozona: 'Entre Rios',
      oldTags: 'El Alfredo, Rincon del Tala',
      newTag: 'El Alfredo'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      lotsIds: '60415aab6c3e2905d45cc9b6, 61278d4dfbde4b22ea047307',
      lotsNames: 'Victor Manuel 2-Ruben Petean-1',
      Centroides: 'POINT(-59.85134944366088 -29.07461330098736)',
      Agrozona: 'NEA',
      oldTags: 'Victor manuel, Victor Manuel',
      newTag: 'Victor Manuel'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      lotsIds: '60415aab6c3e2905d45cc9b7, 61278d4dfbde4b22ea047308',
      lotsNames: 'Victor Manuel 2-Ruben Petean-2',
      Centroides: 'POINT(-59.8507243449419 -29.06431896200444)',
      Agrozona: 'NEA',
      oldTags: 'Victor manuel, Victor Manuel',
      newTag: 'Victor Manuel'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      lotsIds: '60415aab6c3e2905d45cc9a8, 61278d4bfbde4b22ea0472e1',
      lotsNames: 'Barros Passos-120',
      Centroides: 'POINT(-59.76668567613324 -29.24562596541887)',
      Agrozona: 'NEA',
      oldTags: 'Barros Passos, Barros Pazos',
      newTag: 'Barros Passos'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      lotsIds: '60415aab6c3e2905d45cc9b5, 61278d4cfbde4b22ea0472e9',
      lotsNames: 'Las Amintas-50 de perez',
      Centroides: 'POINT(-59.76539974998612 -29.27840170158061)',
      Agrozona: 'NEA',
      oldTags: 'Las Aminitas, Las Amintas',
      newTag: 'Las Amintas'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      lotsIds: '60415aab6c3e2905d45cc9ac, 61278d4afbde4b22ea0472dd',
      lotsNames: 'Alerta-Franco 27',
      Centroides: 'POINT(-59.79753481450306 -29.11503058826739)',
      Agrozona: 'NEA',
      oldTags: 'Alerta, ALERTA',
      newTag: 'ALERTA'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      lotsIds: '60415aab6c3e2905d45cc9ab, 61278d4afbde4b22ea0472dc',
      lotsNames: 'Alerta-Fabrisin chico',
      Centroides: 'POINT(-59.79660952488734 -29.10868979231541)',
      Agrozona: 'NEA',
      oldTags: 'Alerta, ALERTA',
      newTag: 'ALERTA'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      lotsIds: '60415aab6c3e2905d45cc9aa, 61278d4afbde4b22ea0472db',
      lotsNames: 'Alerta-Fabricin Grande',
      Centroides: 'POINT(-59.80273432915666 -29.09779649401663)',
      Agrozona: 'NEA',
      oldTags: 'Alerta, ALERTA',
      newTag: 'ALERTA'
    },
    {
      identifiers: 30708652748,
      companyName: 'MAHURO SA',
      lotsIds:
        '61d5ed82d9f98068f5531237, 61df3b03d9f98068f5548994, 623a277cccf4e35268e016ec',
      lotsNames: 'Lote 1, Lote 1- (36.92 ha)',
      Centroides: 'POINT(-29.97343707375885 -62.0839403952624)',
      Agrozona: 'NEA',
      oldTags: 'El Clavel Blanco, prueba',
      newTag: 'El Clavel Blanco'
    },
    {
      identifiers: 30708652748,
      companyName: 'MAHURO SA',
      lotsIds: '61d5a251d9f98068f55310df, 623a277cccf4e35268e016f4',
      lotsNames: 'Lote 3, Lote 3- (27.65 ha)',
      Centroides: 'POINT(-29.97831890777568 -62.08283242207429)',
      Agrozona: 'NEA',
      oldTags: 'El Clavel Blanco, prueba',
      newTag: 'El Clavel Blanco'
    },
    {
      identifiers: 30708652748,
      companyName: 'MAHURO SA',
      lotsIds: '61d5a251d9f98068f55310de, 623a277cccf4e35268e016f0',
      lotsNames: 'Lote 2, Lote 2- (27.06 ha)',
      Centroides: 'POINT(-29.97836084277433 -62.08796776422312)',
      Agrozona: 'NEA',
      oldTags: 'El Clavel Blanco, prueba',
      newTag: 'El Clavel Blanco'
    },
    {
      identifiers: 30636145749,
      companyName: 'LEIVA HNOS SA',
      lotsIds: '61d5f1f1d9f98068f5531559, 61ddece1d9f98068f5547485',
      lotsNames: '1- (71.43 ha)',
      Centroides: 'POINT(-29.81078828608636 -62.16496605752093)',
      Agrozona: 'NEA',
      oldTags: 'Barn2, La Teo',
      newTag: 'La Teo'
    },
    {
      identifiers: '123123123, 800937414',
      companyName: 'PALMEIRAS SOCIEDAD ANONIMA, Paraguay SDP',
      lotsIds: '624de98efb9ed7611d9c75c4, 6255964e64d760e7e5c60a58',
      lotsNames: 'MARANGATU - E13- (102.28 ha)',
      Centroides: 'POINT(-60.76773535196713 -21.57337632519435)',
      Agrozona: null,
      oldTags: 'MARANGATU, Test',
      newTag: 'MARANGATU'
    },
    {
      identifiers: '123123123, 800937414',
      companyName: 'PALMEIRAS SOCIEDAD ANONIMA, Paraguay SDP',
      lotsIds: '624de98efb9ed7611d9c75bc, 6255964e64d760e7e5c60a50',
      lotsNames: 'MARANGATU - C04- (101.41 ha)',
      Centroides: 'POINT(-60.68672766911035 -21.58882399526006)',
      Agrozona: null,
      oldTags: 'MARANGATU, Test',
      newTag: 'MARANGATU'
    },
    {
      identifiers: '123123123, 800937414',
      companyName: 'PALMEIRAS SOCIEDAD ANONIMA, Paraguay SDP',
      lotsIds: '624de98efb9ed7611d9c75c0, 6255964e64d760e7e5c60a54',
      lotsNames: 'MARANGATU - D04- (101.21 ha)',
      Centroides: 'POINT(-60.7069743445191 -21.58886088748541)',
      Agrozona: null,
      oldTags: 'MARANGATU, Test',
      newTag: 'MARANGATU'
    },
    {
      identifiers: '123123123, 800937414',
      companyName: 'PALMEIRAS SOCIEDAD ANONIMA, Paraguay SDP',
      lotsIds: '624de98efb9ed7611d9c75b8, 6255964e64d760e7e5c60a4c',
      lotsNames: 'MARANGATU - B04- (101.14 ha)',
      Centroides: 'POINT(-60.66647377367795 -21.58884116881936)',
      Agrozona: null,
      oldTags: 'MARANGATU, Test',
      newTag: 'MARANGATU'
    },
    {
      identifiers: '123123123, 800937414',
      companyName: 'PALMEIRAS SOCIEDAD ANONIMA, Paraguay SDP',
      lotsIds: '624de98efb9ed7611d9c75b4, 6255a00564d760e7e5c62c04',
      lotsNames: 'MARANGATU - A06- (82.67 ha)',
      Centroides: 'POINT(-60.64620078386304 -21.57836976361293)',
      Agrozona: null,
      oldTags: '90, MARANGATU',
      newTag: 'MARANGATU'
    },
    {
      identifiers: '123123123, 800019784',
      companyName: 'Ganadera el Fog√≥n S.A., Paraguay SDP',
      lotsIds:
        '61fac82384c3ce3a77778444, 625595e664d760e7e5c60887, 6255a07764d760e7e5c63137, 6255b32564d760e7e5c65e31',
      lotsNames: 'Taita - C3 - 89,82- (90.03 ha), Taita-C3- (90.03 ha)',
      Centroides: 'POINT(-59.569917063746 -21.90653199067474)',
      Agrozona: null,
      oldTags: '123123, Ganadera el Fogon SA - Taita (Chaco), pry2021, qqeqwe',
      newTag: 'TAITA'
    },
    {
      identifiers: '123456789, 800136539',
      companyName: 'PruebaParaguay, ucrop.it LLC',
      lotsIds: '620ec2e61f356a4ef96d4337, 624b5279fb9ed7611d974b4b',
      lotsNames: 'Lote sin sustentabilidad',
      Centroides: 'POINT(-60.77898109163452 -25.05136915861157)',
      Agrozona: 'NEA',
      oldTags: 'Bosque n, campo lean',
      newTag: 'CAMPO DE PRUEBA'
    },
    {
      identifiers: '20252098098, 30716304317',
      companyName: 'EAFA S.A, MARTIN RAFAEL RAIMUNDO',
      lotsIds: '602e6c2234b8842096c578f3, 602ecc06bedcf524bffb34d7',
      lotsNames: 'C14-GUARAN√ç-75HAS, EAFA-C14-GUARAN√ç-75HAS',
      Centroides: 'POINT(-61.55939642953949 -27.39627111233186)',
      Agrozona: 'NEA',
      oldTags:
        'Guaran√≠ La California lotes varios, La California - Martin Rafael R.',
      newTag: 'La California'
    },
    {
      identifiers: '20252098098, 30716304317',
      companyName: 'EAFA S.A, MARTIN RAFAEL RAIMUNDO',
      lotsIds: '602e6c2234b8842096c578f5, 602ecc06bedcf524bffb34d9',
      lotsNames: 'C15-GUARAN√ç-67,5HAS, EAFA-C15-GUARAN√ç-67,5HAS',
      Centroides: 'POINT(-61.57475264833805 -27.40154621144717)',
      Agrozona: 'NEA',
      oldTags:
        'Guaran√≠ La California lotes varios, La California - Martin Rafael R.',
      newTag: 'La California'
    },
    {
      identifiers: '20252098098, 30716304317',
      companyName: 'EAFA S.A, MARTIN RAFAEL RAIMUNDO',
      lotsIds: '602e6c2234b8842096c578f2, 602ecc06bedcf524bffb34d6',
      lotsNames: 'C16-GUARAN√ç-72HAS, EAFA-C16-GUARAN√ç-72HAS',
      Centroides: 'POINT(-61.55908745789746 -27.40156671622322)',
      Agrozona: 'NEA',
      oldTags:
        'Guaran√≠ La California lotes varios, La California - Martin Rafael R.',
      newTag: 'La California'
    },
    {
      identifiers: '20079038343, 20252098098, 30716304317',
      companyName: 'EAFA S.A, MARTIN RAFAEL RAIMUNDO, Miguel Vucko',
      lotsIds:
        '600edff9cf3e497b61d31a8a, 601451ddf50df24fb6d7440a, 602e6c2234b8842096c578f1, 602ecc06bedcf524bffb34d5',
      lotsNames: 'EAFA-N11-GUARAN√ç-71HAS, N11-GUARAN√ç-71HAS',
      Centroides: 'POINT(-61.55907335952134 -27.40652170079541)',
      Agrozona: 'NEA',
      oldTags:
        'Guaran√≠ La California lotes varios, La California, La California - Martin Rafael R., Legua 4',
      newTag: 'La California'
    },
    {
      identifiers: '20252098098, 30716304317',
      companyName: 'EAFA S.A, MARTIN RAFAEL RAIMUNDO',
      lotsIds: '602e6c2234b8842096c578f4, 602ecc06bedcf524bffb34d8',
      lotsNames: 'EAFA-N12-GUARAN√ç-69HAS, N12-GUARAN√ç-69HAS',
      Centroides: 'POINT(-61.57471224027934 -27.40665372255631)',
      Agrozona: 'NEA',
      oldTags:
        'Guaran√≠ La California lotes varios, La California - Martin Rafael R.',
      newTag: 'La California'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds:
        '6060821a1a599f5774d9a33f, 60f96c1969e74b791aba3917, 61522ab9e1b1ef29b68726b5',
      lotsNames: 'L3 MERINO',
      Centroides: 'POINT(-62.14874273535119 -27.59107713650432)',
      Agrozona: 'NEA',
      oldTags: 'Merino, MERINO',
      newTag: 'MERINO'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a341, 60f96c1969e74b791aba3918',
      lotsNames: 'L5 MERINO',
      Centroides: 'POINT(-62.13885935784176 -27.59409102365226)',
      Agrozona: 'NEA',
      oldTags: 'Merino, MERINO',
      newTag: 'MERINO'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a33e, 60f96c1969e74b791aba391b',
      lotsNames: 'L2 MERINO',
      Centroides: 'POINT(-62.14883123276962 -27.59427100840406)',
      Agrozona: 'NEA',
      oldTags: 'Merino, MERINO',
      newTag: 'MERINO'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a340, 60f96c1969e74b791aba391a',
      lotsNames: 'L4 MERINO',
      Centroides: 'POINT(-62.13568651430069 -27.59113853648013)',
      Agrozona: 'NEA',
      oldTags: 'Merino, MERINO',
      newTag: 'MERINO'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a33d, 60f96c1969e74b791aba3919',
      lotsNames: 'L10 MERINO',
      Centroides: 'POINT(-62.15252415699782 -27.61467120298448)',
      Agrozona: 'NEA',
      oldTags: 'Merino, MERINO',
      newTag: 'MERINO'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a345, 612cf05f20f92d1e7d0c1ca4',
      lotsNames: 'L8 SM',
      Centroides: 'POINT(-62.38984056846347 -27.34213217254065)',
      Agrozona: 'NEA',
      oldTags: 'San MArcos, SAN MARCOS',
      newTag: 'SAN MARCOS'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds:
        '60f96c1a69e74b791aba3929, 61ba0bfa09658c5edd22184f, 61ba0fd909658c5edd221860, 61c0a71a2b123f3e6fd9a345, 61c0a7512b123f3e6fd9a355, 61ca0db970c61c237195f177, 6203e4888ff27c511639f48d, 620d46fe82a5cc62483a0fb4',
      lotsNames: 'SM - L8',
      Centroides: 'POINT(-62.38983106379875 -27.34211522188487)',
      Agrozona: 'NEA',
      oldTags:
        'PruebaMaizBlancoUsa, PruebaSojaUsa, san marcos, San Marcos, SAN MARCOS, San marcos USA, San Marcos USA',
      newTag: 'SAN MARCOS'
    },
    {
      identifiers: 30716821699,
      companyName: 'GL SEMILLAS SA',
      lotsIds: '6151ea80e1b1ef29b68723ac, 61f9225b84c3ce3a777770c1',
      lotsNames: 'LOTE 47',
      Centroides: 'POINT(-62.41700785301808 -26.92051949395315)',
      Agrozona: 'NEA',
      oldTags: 'Establecimiento El Tanque, Santa Lucia',
      newTag: 'Establecimiento El Tanque'
    },
    {
      identifiers: 30716821699,
      companyName: 'GL SEMILLAS SA',
      lotsIds: '6151ea80e1b1ef29b68723ab, 61f9225b84c3ce3a777770c0',
      lotsNames: 'LOTE 46',
      Centroides: 'POINT(-62.43469332460218 -26.92093855391336)',
      Agrozona: 'NEA',
      oldTags: 'Establecimiento El Tanque, Santa Lucia',
      newTag: 'Establecimiento El Tanque'
    },
    {
      identifiers: 30707535519,
      companyName: 'EL ESTERO SA',
      lotsIds: '614cf30fb28ab015c72021e7, 61f9225b84c3ce3a777770c3',
      lotsNames: 'LOTE 49',
      Centroides: 'POINT(-62.43964795689694 -26.94334381422348)',
      Agrozona: 'NEA',
      oldTags: 'Establecimiento El Tanque, Santa Lucia',
      newTag: 'Establecimiento El Tanque'
    },
    {
      identifiers: 30707535519,
      companyName: 'EL ESTERO SA',
      lotsIds: '6151cf1ee1b1ef29b68722bd, 61f9247784c3ce3a77777149',
      lotsNames: 'LOTE 51',
      Centroides: 'POINT(-62.43969975726173 -26.96135154394144)',
      Agrozona: 'NEA',
      oldTags: 'Establecimiento El Tanque, Las Garzas',
      newTag: 'Establecimiento El Tanque'
    },
    {
      identifiers: 30716821699,
      companyName: 'GL SEMILLAS SA',
      lotsIds: '6151d5dee1b1ef29b68722f1, 61f9247784c3ce3a7777714e',
      lotsNames: 'LOTE 5 B',
      Centroides: 'POINT(-62.41921539894582 -27.02380418141508)',
      Agrozona: 'NEA',
      oldTags: 'Establecimiento El Tanque, Las Garzas',
      newTag: 'Establecimiento El Tanque'
    },
    {
      identifiers: 30716821699,
      companyName: 'GL SEMILLAS SA',
      lotsIds: '6151d5dee1b1ef29b68722f7, 61f9247784c3ce3a7777714d',
      lotsNames: 'LOTE 5 A',
      Centroides: 'POINT(-62.4678335919129 -27.02393513985803)',
      Agrozona: 'NEA',
      oldTags: 'Establecimiento El Tanque, Las Garzas',
      newTag: 'Establecimiento El Tanque'
    },
    {
      identifiers: 30716821699,
      companyName: 'GL SEMILLAS SA',
      lotsIds: '6151ea80e1b1ef29b68723aa, 61f9225b84c3ce3a777770bf',
      lotsNames: 'LOTE 45',
      Centroides: 'POINT(-62.44978037040828 -26.92092865003494)',
      Agrozona: 'NEA',
      oldTags: 'Establecimiento El Tanque, Santa Lucia',
      newTag: 'Establecimiento El Tanque'
    },
    {
      identifiers: 30716821699,
      companyName: 'GL SEMILLAS SA',
      lotsIds: '6151ea80e1b1ef29b68723a7, 61f9225b84c3ce3a777770bc',
      lotsNames: 'LOTE 42',
      Centroides: 'POINT(-62.49499437456846 -26.92047749128134)',
      Agrozona: 'NEA',
      oldTags: 'Establecimiento El Tanque, Santa Lucia',
      newTag: 'Establecimiento El Tanque'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '60635dcd1a599f5774d9ae45, 61522ab9e1b1ef29b68726c5',
      lotsNames: 'L8 Petocha',
      Centroides: 'POINT(-62.67525214030182 -27.40369682306747)',
      Agrozona: 'NEA',
      oldTags: 'La Petocha, LA PETOCHA',
      newTag: 'LA PETOCHA'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '60635dcd1a599f5774d9ae4a, 61522ab9e1b1ef29b68726c6',
      lotsNames: 'L 7 Petocha',
      Centroides: 'POINT(-62.6747454628248 -27.40824131774442)',
      Agrozona: 'NEA',
      oldTags: 'La Petocha, LA PETOCHA',
      newTag: 'LA PETOCHA'
    },
    {
      identifiers: '30506176278, 30715361848',
      companyName: 'Gensus S.A., Viluco',
      lotsIds: '60103d4ff8d0db4a8ef086d3, 601450aaf50df24fb6d743fd',
      lotsNames: 'Viluco-Lote1-33 has-G4',
      Centroides: 'POINT(-64.23314286324613 -27.97795721341979)',
      Agrozona: null,
      oldTags: 'La margarita, Viluco',
      newTag: 'La Margarita'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a33a, 60f96c1869e74b791aba3910',
      lotsNames: 'L15 LG',
      Centroides: 'POINT(-62.62853127869997 -27.97817854347748)',
      Agrozona: 'NEA',
      oldTags: 'La Gaviota, LA GAVIOTA',
      newTag: 'LA GAVIOTA'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a339, 60f96c1869e74b791aba3911',
      lotsNames: 'L14 LG',
      Centroides: 'POINT(-62.62997344804335 -27.98102361104079)',
      Agrozona: 'NEA',
      oldTags: 'La Gaviota, LA GAVIOTA',
      newTag: 'LA GAVIOTA'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a336, 60f96c1869e74b791aba390d',
      lotsNames: 'L4 LG',
      Centroides: 'POINT(-62.66086639133363 -27.97572245111715)',
      Agrozona: 'NEA',
      oldTags: 'La Gaviota, LA GAVIOTA',
      newTag: 'LA GAVIOTA'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a338, 60f96c1869e74b791aba390e',
      lotsNames: 'L9 LG',
      Centroides: 'POINT(-62.64482801353424 -27.97548472997569)',
      Agrozona: 'NEA',
      oldTags: 'La Gaviota, LA GAVIOTA',
      newTag: 'LA GAVIOTA'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a33b, 60f96c1869e74b791aba390f',
      lotsNames: 'L16 LG',
      Centroides: 'POINT(-62.62827283221026 -27.97518861030193)',
      Agrozona: 'NEA',
      oldTags: 'La Gaviota, LA GAVIOTA',
      newTag: 'LA GAVIOTA'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a32d, 60f96c1869e74b791aba3908',
      lotsNames: 'L4 20has Brandan',
      Centroides: 'POINT(-62.28067082886154 -27.80271050130537)',
      Agrozona: 'NEA',
      oldTags: 'Brandan, BRANDAN',
      newTag: 'BRANDAN'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds:
        '6060821a1a599f5774d9a32b, 60f96c1869e74b791aba3909, 612ce7ff20f92d1e7d0c1a36',
      lotsNames: 'L1 Brandan',
      Centroides: 'POINT(-62.27349971184276 -27.77642146821048)',
      Agrozona: 'NEA',
      oldTags: 'Brandan, BRANDAN',
      newTag: 'BRANDAN'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6060821a1a599f5774d9a32c, 60f96c1869e74b791aba3907',
      lotsNames: 'L2 Brandan 88 ha',
      Centroides: 'POINT(-62.26455276178659 -27.77839030412153)',
      Agrozona: 'NEA',
      oldTags: 'Brandan, BRANDAN',
      newTag: 'BRANDAN'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '6128f62420f92d1e7d0c0c70, 61c4bf7e70c61c237195dafc',
      lotsNames: 'L1 ER',
      Centroides: 'POINT(-62.43428861880133 -27.93072752052913)',
      Agrozona: 'NEA',
      oldTags: '123, EL RETIRO',
      newTag: 'EL RETIRO'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds: '612cf05e20f92d1e7d0c1c88, 61c4bf7e70c61c237195daf9',
      lotsNames: 'El Retiro lote 5 y 6',
      Centroides: 'POINT(-62.43397064778792 -27.9401985374773)',
      Agrozona: 'NEA',
      oldTags: '123, EL RETIRO',
      newTag: 'EL RETIRO'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      lotsIds:
        '6060821a1a599f5774d9a331, 612cf05e20f92d1e7d0c1c89, 61c4bf7e70c61c237195dafa, 6206ca8c8ff27c51163ab097',
      lotsNames: 'L4 ER',
      Centroides: 'POINT(-62.40779211438179 -27.94747764760797)',
      Agrozona: 'NEA',
      oldTags: '123, El Retiro, EL RETIRO',
      newTag: 'EL RETIRO'
    },
    {
      identifiers: '123123123, 800019784',
      companyName: 'Ganadera el Fog√≥n S.A., Paraguay SDP',
      lotsIds: '6181d432fd39e412443fbc9f, 6255955464d760e7e5c604ac',
      lotsNames: 'Katuete - 3K/1- (16.44 ha)',
      Centroides: 'POINT(-55.94302497579122 -25.88662096953788)',
      Agrozona: null,
      oldTags: 'Ganadera el Fogon SA - Katuete, pry',
      newTag: 'KATUETE'
    }
  ],
  CASE_4: [
    {
      identifiers: 80098961,
      companyName: 'AGROGANADERA CARAPA SOCIEDAD ANONIMA',
      Localidad: 'FRANCISCO CABALLERO ALVAREZ',
      Agrozona: null,
      Campo: 'Agroganadera Carapa 1',
      oldTags:
        "['Agroganadera Carapa 1', 'Agroganadera Carapa 1.1', 'Agroganadera Carapa 2']",
      newTag: 'Agroganadera Carapa 1'
    },
    {
      identifiers: 80098961,
      companyName: 'AGROGANADERA CARAPA SOCIEDAD ANONIMA',
      Localidad: 'CORPUS CHRISTI',
      Agrozona: null,
      Campo: 'Agroganadera Carapa 2',
      oldTags:
        "['Agroganadera Carapa 2', 'Agroganadera Carapa 1', 'Agroganadera Carapa 1.1']",
      newTag: 'Agroganadera Carapa 2'
    },
    {
      identifiers: 80098961,
      companyName: 'AGROGANADERA CARAPA SOCIEDAD ANONIMA',
      Localidad: 'FRANCISCO CABALLERO ALVAREZ',
      Agrozona: null,
      Campo: 'Agroganadera Carapa 1.1',
      oldTags:
        "['Agroganadera Carapa 1.1', 'Agroganadera Carapa 1', 'Agroganadera Carapa 2']",
      newTag: 'Agroganadera Carapa 1.1'
    },
    {
      identifiers: 800019784,
      companyName: 'Ganadera el Fogón S.A.',
      Localidad: 'ABAI',
      Agrozona: null,
      Campo: 'Ganadera el Fogon SA - Katuete',
      oldTags:
        "['Ganadera el Fogon SA - Katuete', 'Ganadera el Fogon SA - Vya']",
      newTag: 'VYA'
    },
    {
      identifiers: 800019784,
      companyName: 'Ganadera el Fogón S.A.',
      Localidad: 'SAN JUAN BAUTISTA',
      Agrozona: null,
      Campo: 'Ganadera el Fogon SA - Vya',
      oldTags:
        "['Ganadera el Fogon SA - Vya', 'Ganadera el Fogon SA - Katuete']",
      newTag: 'VYA'
    },
    {
      identifiers: 800464885,
      companyName: 'AGROPECUARIA BUSANELLO S.A.',
      Localidad: 'SAN CRISTOBAL',
      Agrozona: null,
      Campo: 'Agropecuaria Busanello S.A. - Naranjal',
      oldTags:
        "['Agropecuaria Busanello S.A. - Naranjal', 'Agropecuaria Busanello S.A. - Naranjal', 'Agropecuaria Busanello S.A. - Artigas']",
      newTag: 'NARANJAL'
    },
    {
      identifiers: 800464885,
      companyName: 'AGROPECUARIA BUSANELLO S.A.',
      Localidad: 'NARANJAL',
      Agrozona: null,
      Campo: 'Agropecuaria Busanello S.A. - Naranjal',
      oldTags:
        "['Agropecuaria Busanello S.A. - Naranjal', 'Agropecuaria Busanello S.A. - Naranjal', 'Agropecuaria Busanello S.A. - Artigas']",
      newTag: 'NARANJAL'
    },
    {
      identifiers: 20107129937,
      companyName: 'SUCESION DE EMMERT JULIAN MARCELO',
      Localidad: 'Las Colonias',
      Agrozona: 'NBA-SSF',
      Campo: 'Bonomi 1',
      oldTags: "['Bonomi 1', 'Bonomi']",
      newTag: 'Bonomi'
    },
    {
      identifiers: 20107129937,
      companyName: 'SUCESION DE EMMERT JULIAN MARCELO',
      Localidad: 'Las Colonias',
      Agrozona: 'NBA-SSF',
      Campo: 'Bonomi',
      oldTags: "['Bonomi', 'Bonomi 1']",
      newTag: 'Bonomi'
    },
    {
      identifiers: 20115572564,
      companyName: 'BOSCO JUAN CARLOS',
      Localidad: 'San Justo',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Bosco Juan Carlos - Bollati',
      oldTags:
        "['Bosco Juan Carlos - Bollati ', 'Bosco Juan Carlos - Bollati']",
      newTag: 'Bollati'
    },
    {
      identifiers: 20115572564,
      companyName: 'BOSCO JUAN CARLOS',
      Localidad: 'San Justo',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Bosco Juan Carlos - Bollati',
      oldTags:
        "['Bosco Juan Carlos - Bollati', 'Bosco Juan Carlos - Bollati ']",
      newTag: 'Bollati'
    },
    {
      identifiers: 20116830184,
      companyName: 'REIM PABLO ALEJANDRO',
      Localidad: 'Alberdi',
      Agrozona: 'NEA',
      Campo: 'Don Armando',
      oldTags: "['Don Armando', ' Don Armando']",
      newTag: 'Don Armando'
    },
    {
      identifiers: 20116830184,
      companyName: 'REIM PABLO ALEJANDRO',
      Localidad: 'Alberdi',
      Agrozona: 'NEA',
      Campo: 'Don Armando',
      oldTags: "[' Don Armando', 'Don Armando']",
      newTag: 'Don Armando'
    },
    {
      identifiers: 20179962048,
      companyName: 'Carlos José Calvi',
      Localidad: 'Nogoya',
      Agrozona: 'Entre Rios',
      Campo: 'Hernandez',
      oldTags: "['Hernandez ', 'Hernandez']",
      newTag: 'Hernandez'
    },
    {
      identifiers: 20179962048,
      companyName: 'Carlos José Calvi',
      Localidad: 'Nogoya',
      Agrozona: 'Entre Rios',
      Campo: 'Hernandez',
      oldTags: "['Hernandez', 'Hernandez ']",
      newTag: 'Hernandez'
    },
    {
      identifiers: 20225377449,
      companyName: 'BURGARDT DANIEL ADOLFO',
      Localidad: 'San Javier',
      Agrozona: 'NBA-SSF',
      Campo: 'Eucalipto',
      oldTags: "['Eucalipto', 'El Eucalipto']",
      newTag: 'El Eucalipto'
    },
    {
      identifiers: 20225377449,
      companyName: 'BURGARDT DANIEL ADOLFO',
      Localidad: 'San Javier',
      Agrozona: 'NBA-SSF',
      Campo: 'El Eucalipto',
      oldTags: "['El Eucalipto', 'Eucalipto']",
      newTag: 'El Eucalipto'
    },
    {
      identifiers: 20314531060,
      companyName: 'Ignacio Bravo',
      Localidad: 'Tandil',
      Agrozona: 'SE',
      Campo: 'San German.',
      oldTags: "['San German.', 'San German']",
      newTag: 'San German'
    },
    {
      identifiers: 20314531060,
      companyName: 'Ignacio Bravo',
      Localidad: 'Tandil',
      Agrozona: 'SE',
      Campo: 'San German',
      oldTags: "['San German', 'San German.']",
      newTag: 'San German'
    },
    {
      identifiers: 20387678493,
      companyName: 'KALBERMATTER ROBERTO ALEJANDRO',
      Localidad: '12 de Octubre',
      Agrozona: 'NEA',
      Campo: 'El Galpon',
      oldTags: "['El Galpon', 'El Galpón']",
      newTag: 'El Galpon'
    },
    {
      identifiers: 20387678493,
      companyName: 'KALBERMATTER ROBERTO ALEJANDRO',
      Localidad: '12 de Octubre',
      Agrozona: 'NEA',
      Campo: 'Ciucci',
      oldTags: "['Ciucci', ' Ciucci']",
      newTag: 'Ciucci'
    },
    {
      identifiers: 20387678493,
      companyName: 'KALBERMATTER ROBERTO ALEJANDRO',
      Localidad: '12 de Octubre',
      Agrozona: 'NEA',
      Campo: 'El Galpón',
      oldTags: "['El Galpón', ' El Galpón', 'El Galpon']",
      newTag: 'El Galpon'
    },
    {
      identifiers: 20387678493,
      companyName: 'KALBERMATTER ROBERTO ALEJANDRO',
      Localidad: '12 de Octubre',
      Agrozona: 'NEA',
      Campo: 'Ciucci',
      oldTags: "[' Ciucci', 'Ciucci']",
      newTag: 'Ciucci'
    },
    {
      identifiers: 20387678493,
      companyName: 'KALBERMATTER ROBERTO ALEJANDRO',
      Localidad: '12 de Octubre',
      Agrozona: 'NEA',
      Campo: 'El Galpón',
      oldTags: "[' El Galpón', 'El Galpón']",
      newTag: 'El Galpon'
    },
    {
      identifiers: 30507925665,
      companyName: 'Establecimiento Gallinao S. A.',
      Localidad: 'General Roca',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'El Gallinao',
      oldTags: "['El Gallinao', 'El Gallinao ']",
      newTag: 'Gallinao'
    },
    {
      identifiers: 30507925665,
      companyName: 'Establecimiento Gallinao S. A.',
      Localidad: 'General Roca',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'El Gallinao',
      oldTags: "['El Gallinao ', 'El Gallinao']",
      newTag: 'Gallinao'
    },
    {
      identifiers: 30509305206,
      companyName: 'ESTANAR ESTANCIAS ARGENTINAS SA',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'La Payanca 1',
      oldTags: "['La Payanca 1', 'La Payanca 2']",
      newTag: 'La Payanca '
    },
    {
      identifiers: 30509305206,
      companyName: 'ESTANAR ESTANCIAS ARGENTINAS SA',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'La Payanca 2',
      oldTags: "['La Payanca 2', 'La Payanca 1']",
      newTag: 'La Payanca '
    },
    {
      identifiers: 30509334206,
      companyName: 'ZERBONI SOC RESP LTDA',
      Localidad: 'San Antonio de Areco',
      Agrozona: 'NBA-SSF',
      Campo: 'Rio Areco',
      oldTags: "['Rio Areco', 'Río Areco']",
      newTag: 'Rio Areco'
    },
    {
      identifiers: 30509334206,
      companyName: 'ZERBONI SOC RESP LTDA',
      Localidad: 'San Antonio de Areco',
      Agrozona: 'NBA-SSF',
      Campo: 'Río Areco',
      oldTags: "['Río Areco', 'Rio Areco']",
      newTag: 'Río Areco'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      Localidad: 'Pehuajó',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Montenovo 21-22',
      oldTags: "['Montenovo 21-22', 'Montenovo 21-22', 'Montenovo 21/22']",
      newTag: 'Montenovo 21-22'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      Localidad: 'Pehuajó',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Montenovo 21/22',
      oldTags: "['Montenovo 21/22', 'Montenovo 21/22', 'Montenovo 21-22']",
      newTag: 'Montenovo 21-22'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      Localidad: 'Carlos Tejedor',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Montenovo 21-22',
      oldTags: "['Montenovo 21-22', 'Montenovo 21-22', 'Montenovo 21/22']",
      newTag: 'Montenovo 21-22'
    },
    {
      identifiers: 30513687156,
      companyName: 'ALFREDO MONTENOVO S A AGROPECUARIA Y COMERCIAL',
      Localidad: 'Carlos Tejedor',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Montenovo 21/22',
      oldTags: "['Montenovo 21/22', 'Montenovo 21/22', 'Montenovo 21-22']",
      newTag: 'Montenovo 21-22'
    },
    {
      identifiers: 30548695054,
      companyName: 'ESTANCIA Y CABAÑA SANTO DOMINGO S.C.A',
      Localidad: 'Lobería',
      Agrozona: 'SE',
      Campo: 'Santo Domingo',
      oldTags: "['Santo Domingo', 'Santo Domingo.', 'Santo Domingo -.']",
      newTag: 'Santo Domingo '
    },
    {
      identifiers: 30548695054,
      companyName: 'ESTANCIA Y CABAÑA SANTO DOMINGO S.C.A',
      Localidad: 'Lobería',
      Agrozona: 'SE',
      Campo: 'Santo Domingo.',
      oldTags: "['Santo Domingo.', 'Santo Domingo', 'Santo Domingo -.']",
      newTag: 'Santo Domingo '
    },
    {
      identifiers: 30548695054,
      companyName: 'ESTANCIA Y CABAÑA SANTO DOMINGO S.C.A',
      Localidad: 'Lobería',
      Agrozona: 'SE',
      Campo: 'Santo Domingo --',
      oldTags: "['Santo Domingo --', 'Santo Domingo ---', 'Santo Domingo -.']",
      newTag: 'Santo Domingo '
    },
    {
      identifiers: 30548695054,
      companyName: 'ESTANCIA Y CABAÑA SANTO DOMINGO S.C.A',
      Localidad: 'Lobería',
      Agrozona: 'SE',
      Campo: 'Santo Domingo ---',
      oldTags: "['Santo Domingo ---', 'Santo Domingo --', 'Santo Domingo -.']",
      newTag: 'Santo Domingo '
    },
    {
      identifiers: 30548695054,
      companyName: 'ESTANCIA Y CABAÑA SANTO DOMINGO S.C.A',
      Localidad: 'Lobería',
      Agrozona: 'SE',
      Campo: 'Santo Domingo -.',
      oldTags: "['Santo Domingo -.', 'Santo Domingo --', 'Santo Domingo.']",
      newTag: 'Santo Domingo '
    },
    {
      identifiers: 30550246771,
      companyName: 'ANTA DEL DORADO SA',
      Localidad: 'Orán',
      Agrozona: 'NOA',
      Campo: 'Los Bretes',
      oldTags: "['Los Bretes', 'Los bretes']",
      newTag: 'Los Bretes'
    },
    {
      identifiers: 30550246771,
      companyName: 'ANTA DEL DORADO SA',
      Localidad: 'Orán',
      Agrozona: 'NOA',
      Campo: 'Los bretes',
      oldTags: "['Los bretes', 'Los Bretes']",
      newTag: 'Los Bretes'
    },
    {
      identifiers: 30558314539,
      companyName: 'TILO PAMPA SA',
      Localidad: 'General López',
      Agrozona: 'NBA-SSF',
      Campo: 'La Esperanza',
      oldTags: "['La Esperanza', 'Esperanza']",
      newTag: 'Esperanza'
    },
    {
      identifiers: 30558314539,
      companyName: 'TILO PAMPA SA',
      Localidad: 'General López',
      Agrozona: 'NBA-SSF',
      Campo: 'Esperanza',
      oldTags: "['Esperanza', 'La Esperanza']",
      newTag: 'Esperanza'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      Localidad: 'Maracó',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Esperanza tg',
      oldTags: "['La Esperanza tg', 'La Esperanza', 'La Esperanza Mz']",
      newTag: 'La Esperanza'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      Localidad: 'Quemú Quemú',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Carreta Mz',
      oldTags: "['La Carreta Mz', 'La Carreta']",
      newTag: 'La Carreta'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      Localidad: 'Maracó',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Esperanza Mz',
      oldTags: "['La Esperanza Mz', 'La Esperanza', 'La Esperanza tg']",
      newTag: 'La Esperanza'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      Localidad: 'Quemú Quemú',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Carreta',
      oldTags: "['La Carreta', 'La Carreta Mz']",
      newTag: 'La Carreta'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      Localidad: 'Maracó',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Don Jesus',
      oldTags: "['Don Jesus', 'Don Jesus Mz']",
      newTag: 'Don Jesus'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      Localidad: 'Maracó',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Rosa Elba',
      oldTags: "['Rosa Elba', 'La Rosa Elba']",
      newTag: 'La Rosa Elba'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      Localidad: 'Maracó',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Rosa Elba',
      oldTags: "['La Rosa Elba', 'Rosa Elba']",
      newTag: 'La Rosa Elba'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      Localidad: 'Maracó',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Don Jesus Mz',
      oldTags: "['Don Jesus Mz', 'Don Jesus Mz1', 'Don Jesus']",
      newTag: 'Don Jesus'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      Localidad: 'Maracó',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Don Jesus Mz1',
      oldTags: "['Don Jesus Mz1', 'Don Jesus Mz']",
      newTag: 'Don Jesus'
    },
    {
      identifiers: 30560233694,
      companyName: 'L. Y O. CIVALERO SRL',
      Localidad: 'Maracó',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Esperanza',
      oldTags: "['La Esperanza', 'La Esperanza tg', 'La Esperanza Mz']",
      newTag: 'La Esperanza'
    },
    {
      identifiers: 30588855631,
      companyName: 'SOCIEDAD ANONIMA LA SIBILA',
      Localidad: 'Iriondo',
      Agrozona: 'NBA-SSF',
      Campo: 'La Loma',
      oldTags: "['La Loma', 'La Lomas']",
      newTag: 'La Loma'
    },
    {
      identifiers: 30588855631,
      companyName: 'SOCIEDAD ANONIMA LA SIBILA',
      Localidad: 'Iriondo',
      Agrozona: 'NBA-SSF',
      Campo: 'La Lomas',
      oldTags: "['La Lomas', 'La Loma']",
      newTag: 'La Loma'
    },
    {
      identifiers: 30604456475,
      companyName: 'LOS GROBO AGROPECUARIA SA',
      Localidad: 'Carlos Casares',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Esperanza Andreoli',
      oldTags: "['La Esperanza Andreoli', 'La esperanza Andreoli']",
      newTag: 'La Esperanza Andreoli'
    },
    {
      identifiers: 30604456475,
      companyName: 'LOS GROBO AGROPECUARIA SA',
      Localidad: 'Carlos Casares',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La esperanza Andreoli',
      oldTags: "['La esperanza Andreoli', 'La Esperanza Andreoli']",
      newTag: 'La Esperanza Andreoli'
    },
    {
      identifiers: 30605813182,
      companyName:
        'ALBINO LUIS ZORZON E HIJOS SH DE ZORZON OMAR A ZORZON ABEL A ZORZON ALDO L ZORZON MARIO A ZORZON OSCAR D',
      Localidad: 'General Obligado',
      Agrozona: 'NEA',
      Campo: 'La lola',
      oldTags: "['La lola', 'La Lola']",
      newTag: 'La Lola'
    },
    {
      identifiers: 30605813182,
      companyName:
        'ALBINO LUIS ZORZON E HIJOS SH DE ZORZON OMAR A ZORZON ABEL A ZORZON ALDO L ZORZON MARIO A ZORZON OSCAR D',
      Localidad: 'General Obligado',
      Agrozona: 'NEA',
      Campo: 'La Lola',
      oldTags: "['La Lola', 'La lola']",
      newTag: 'La Lola'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Quemú Quemú',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Maria',
      oldTags: "['La Maria', 'La Maria', 'Las Marias']",
      newTag: 'La Maria'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'Santa Margarita',
      oldTags: "['Santa Margarita', 'Santa Margarita', 'Santa Margarita Hill']",
      newTag: 'Santa Margarita'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Carlos Tejedor',
      Agrozona: 'NBA-SSF',
      Campo: 'Santa Margarita',
      oldTags: "['Santa Margarita', 'Santa Margarita', 'Santa Margarita Hill']",
      newTag: 'Santa Margarita'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Saladillo',
      Agrozona: 'SE',
      Campo: 'Las Taperas',
      oldTags: "['Las Taperas', 'La Tapera']",
      newTag: 'La Tapera'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Rivadavia',
      Agrozona: 'NBA-SSF',
      Campo: 'La Elisa',
      oldTags: "['La Elisa', 'La Elisa', 'La Eliza']",
      newTag: 'La Elisa'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Rivadavia',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Elisa',
      oldTags: "['La Elisa', 'La Elisa', 'La Eliza']",
      newTag: 'La Elisa'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'General López',
      Agrozona: 'NBA-SSF',
      Campo: 'La Sirena 2',
      oldTags: "['La Sirena 2', 'La Sirena']",
      newTag: 'La Sirena'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'General López',
      Agrozona: 'NBA-SSF',
      Campo: 'San Bernardo',
      oldTags: "['San Bernardo', 'San Bernardo', 'San Bernardo II']",
      newTag: 'San Bernardo'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'General López',
      Agrozona: 'NBA-SSF',
      Campo: 'San Bernardo II',
      oldTags: "['San Bernardo II', 'San Bernardo', 'San Bernardo']",
      newTag: 'San Bernardo'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Cañuelas',
      Agrozona: 'SE',
      Campo: 'Las Lomas',
      oldTags: "['Las Lomas', 'La Loma']",
      newTag: 'Las Lomas'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Carlos Tejedor',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Merced',
      oldTags: "['La Merced', 'Las Mercedes']",
      newTag: 'La Merced'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Carlos Tejedor',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Las Mercedes',
      oldTags: "['Las Mercedes', 'La Merced']",
      newTag: 'La Mercedes'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Carlos Tejedor',
      Agrozona: 'NBA-SSF',
      Campo: 'Santa Margarita Hill',
      oldTags: "['Santa Margarita Hill', 'Santa Margarita', 'Santa Margarita']",
      newTag: 'San ta Margarita'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Coronel Suárez',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Sauce Corto',
      oldTags: "['Sauce Corto', 'Sauce corto']",
      newTag: 'Sauce Corto'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'La MAria',
      oldTags: "['La MAria', 'La Maria', 'La Maria']",
      newTag: 'La Maria'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Coronel Suárez',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Sauce corto',
      oldTags: "['Sauce corto', 'Sauce Corto']",
      newTag: 'Sauce Corto'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'General López',
      Agrozona: 'NBA-SSF',
      Campo: 'La Sirena',
      oldTags: "['La Sirena', 'La Sirena 2']",
      newTag: 'La Sirena'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'General Pinto',
      Agrozona: 'NBA-SSF',
      Campo: 'San Bernardo',
      oldTags: "['San Bernardo', 'San Bernardo', 'San Bernardo II']",
      newTag: 'San Bernardo'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Chapaleufú',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Las Mari',
      oldTags: "['Las Mari', 'Las Marias', 'La Maria']",
      newTag: 'Las Marias'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'La Maria',
      oldTags: "['La Maria', 'La Maria', 'Las Marias']",
      newTag: 'La Maria'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'La Tapera',
      oldTags: "['La Tapera', 'Las Taperas']",
      newTag: 'La Tapera'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Daireaux',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Eliza',
      oldTags: "['La Eliza', 'La Elisa', 'La Elisa']",
      newTag: 'La Eliza'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Loma',
      oldTags: "['La Loma', 'Las Lomas']",
      newTag: 'Las Lomas'
    },
    {
      identifiers: 30613985995,
      companyName: 'Lartirigoyen y Cia S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'Las Marias',
      oldTags: "['Las Marias', 'Las Mari', 'La Maria']",
      newTag: 'La Maria'
    },
    {
      identifiers: 30617372467,
      companyName: 'DINFE S A',
      Localidad: 'Olavarría',
      Agrozona: 'OBA - La Pampa',
      Campo: 'San Femin',
      oldTags: "['San Femin', 'San Fermin']",
      newTag: 'San Fermin'
    },
    {
      identifiers: 30617372467,
      companyName: 'DINFE S A',
      Localidad: 'Olavarría',
      Agrozona: 'OBA - La Pampa',
      Campo: 'San Fermin',
      oldTags: "['San Fermin', 'San Femin']",
      newTag: 'San Fermin'
    },
    {
      identifiers: 30623790181,
      companyName: 'PEDRO A LACAU E HIJOS S R L',
      Localidad: 'General Pinto',
      Agrozona: 'NBA-SSF',
      Campo: 'La Loma',
      oldTags: "['La Loma', 'Las Lomas']",
      newTag: 'La Loma'
    },
    {
      identifiers: 30623790181,
      companyName: 'PEDRO A LACAU E HIJOS S R L',
      Localidad: 'San Pedro',
      Agrozona: 'NBA-SSF',
      Campo: 'Las Lomas',
      oldTags: "['Las Lomas', 'La Loma']",
      newTag: 'La Loma'
    },
    {
      identifiers: 30624322637,
      companyName: 'MERIDIANO QUINTO SRL',
      Localidad: 'Hipólito Yrigoyen',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Magdalena ESTE',
      oldTags: "['La Magdalena ESTE', 'La Magdalena OESTE']",
      newTag: 'La Magdalena Este'
    },
    {
      identifiers: 30624322637,
      companyName: 'MERIDIANO QUINTO SRL',
      Localidad: 'Hipólito Yrigoyen',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Magdalena OESTE',
      oldTags: "['La Magdalena OESTE', 'La Magdalena ESTE']",
      newTag: 'La Magdalena Oeste'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      Localidad: 'General Obligado',
      Agrozona: 'NEA',
      Campo: 'Las Aminitas',
      oldTags: "['Las Aminitas', 'Las Amintas']",
      newTag: 'Las Aminitas'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      Localidad: 'General Obligado',
      Agrozona: 'NEA',
      Campo: 'Barros Pazos',
      oldTags: "['Barros Pazos', 'Barros Passos']",
      newTag: 'Barros Passos'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      Localidad: 'General Obligado',
      Agrozona: 'NEA',
      Campo: 'Victor Manuel',
      oldTags: "['Victor Manuel', 'Victor manuel']",
      newTag: 'Victor Manuel'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      Localidad: 'General Obligado',
      Agrozona: 'NEA',
      Campo: 'Victor manuel',
      oldTags: "['Victor manuel', 'Victor Manuel']",
      newTag: 'Victor Manuel'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      Localidad: 'General Obligado',
      Agrozona: 'NEA',
      Campo: 'Barros Passos',
      oldTags: "['Barros Passos', 'Barros Pazos']",
      newTag: 'Barros Passos'
    },
    {
      identifiers: 30634259569,
      companyName: 'ESTABLECIMIENTO DON AVELINO SRL',
      Localidad: 'General Obligado',
      Agrozona: 'NEA',
      Campo: 'Las Amintas',
      oldTags: "['Las Amintas', 'Las Aminitas']",
      newTag: 'Las Aminitas'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Hipólito Yrigoyen',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Dorita Mz',
      oldTags: "['La Dorita Mz', 'La Dorita']",
      newTag: 'La Dorita'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Daireaux',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Golondrina Este',
      oldTags:
        "['La Golondrina Este', 'La Golondrina Oeste', 'La Golondrina E']",
      newTag: 'La Golondrina Este'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Necochea',
      Agrozona: 'SE',
      Campo: 'Tres Marías',
      oldTags: "['Tres Marías', 'Tres Marías', 'Tres Marias']",
      newTag: 'Tres Marías'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'General Viamonte',
      Agrozona: 'NBA-SSF',
      Campo: 'Tres Marías',
      oldTags: "['Tres Marías', 'Tres Marías', 'Tres Marias']",
      newTag: 'Tres Marías'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Pergamino',
      Agrozona: 'NBA-SSF',
      Campo: 'San Federico',
      oldTags: "['San Federico', 'San Federico II']",
      newTag: 'San Federico'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'General Pueyrredón',
      Agrozona: 'SE',
      Campo: 'San Jose de Iguazu',
      oldTags: "['San Jose de Iguazu', 'San Jose Iguazu']",
      newTag: 'San Jose de Iguazu'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Lobería',
      Agrozona: 'SE',
      Campo: 'La Magdalena',
      oldTags: "['La Magdalena', 'La Magdalena', 'La Magdalena SE']",
      newTag: 'La Magdalena'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Necochea',
      Agrozona: 'SE',
      Campo: 'Tres Marias',
      oldTags: "['Tres Marias', 'Tres Marías', 'Tres Marías']",
      newTag: 'Tres Marias'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Guaminí',
      Agrozona: 'OBA - La Pampa',
      Campo: 'El Silencio',
      oldTags: "['El Silencio', 'El Silencio AO', 'El Silencio AO']",
      newTag: 'El Silencio'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Hipólito Yrigoyen',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Gure Extea',
      oldTags: "['Gure Extea', 'Gure Etxea']",
      newTag: 'Gure Etxea'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Hipólito Yrigoyen',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Dorita',
      oldTags: "['La Dorita', 'La Dorita Mz']",
      newTag: 'La Dorita'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Daireaux',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Golondrina Oeste',
      oldTags:
        "['La Golondrina Oeste', 'La Golondrina Este', 'La Golondrina O']",
      newTag: 'La Golondrina Oeste'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'La Constanza',
      oldTags: "['La Constanza ', 'La Constanza']",
      newTag: 'La Constanza'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'NBA-SSF',
      Campo: 'El Pegual',
      oldTags: "['El Pegual ', 'El Pegual']",
      newTag: 'El Pegual'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Lleonor',
      oldTags: "['La Lleonor', 'La Lleonor', 'La Leonor']",
      newTag: 'La Lleonor'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'NBA-SSF',
      Campo: 'La Lleonor',
      oldTags: "['La Lleonor', 'La Lleonor', 'La Leonor']",
      newTag: 'La Lleonor'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'NBA-SSF',
      Campo: 'La Magdalena',
      oldTags: "['La Magdalena', 'La Magdalena', 'La Magdalena SE']",
      newTag: 'La Magdalena'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Lobería',
      Agrozona: 'SE',
      Campo: 'La Magdalena SE',
      oldTags: "['La Magdalena SE', 'La Magdalena', 'La Magdalena']",
      newTag: 'La Magdalena'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'General Pueyrredón',
      Agrozona: 'SE',
      Campo: 'San Jose Iguazu',
      oldTags: "['San Jose Iguazu', 'San Jose de Iguazu']",
      newTag: 'San Jose de Iguazu'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'General Juan Madariaga',
      Agrozona: 'SE',
      Campo: 'La loma',
      oldTags: "['La loma', 'La Loma']",
      newTag: 'La loma'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'NBA-SSF',
      Campo: 'La Leonor',
      oldTags: "['La Leonor', 'La Lleonor', 'La Lleonor']",
      newTag: 'La Lleonor'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'NBA-SSF',
      Campo: 'El Pegual',
      oldTags: "['El Pegual', 'El Pegual ', 'El Pehual']",
      newTag: 'El Pehual'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'La Constanza',
      oldTags: "['La Constanza', 'La Constanza ']",
      newTag: 'La Constanza'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Guaminí',
      Agrozona: 'OBA - La Pampa',
      Campo: 'El Silencio AO',
      oldTags: "['El Silencio AO', 'El Silencio AO', 'El Silencio']",
      newTag: 'El Silencio'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Daireaux',
      Agrozona: 'OBA - La Pampa',
      Campo: 'El Silencio AO',
      oldTags: "['El Silencio AO', 'El Silencio AO', 'El Silencio']",
      newTag: 'El Silencio'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Daireaux',
      Agrozona: 'OBA - La Pampa',
      Campo: null,
      oldTags: "['San Jose Del Encuentro AO', 'San Jose del Encuentro']",
      newTag: 'San Jose Del Encuentro'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Daireaux',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Maldagain AO',
      oldTags: "['Maldagain AO', 'Maldagain']",
      newTag: 'Maldagain'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Río Cuarto',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Charras 2',
      oldTags: "['Charras 2', 'Charras 2', 'Charras']",
      newTag: 'Charras 2'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Juárez Celman',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Charras 2',
      oldTags: "['Charras 2', 'Charras 2', 'Charras']",
      newTag: 'Charras 2'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Río Cuarto',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Charras',
      oldTags: "['Charras', 'Charras 2', 'Charras 2']",
      newTag: 'Charras'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Daireaux',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Maldagain',
      oldTags: "['Maldagain', 'Maldagain AO']",
      newTag: 'Maldagain'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Daireaux',
      Agrozona: 'OBA - La Pampa',
      Campo: 'x',
      oldTags: "['La Golondrina O', 'La Golondrina E', 'La Golondrina Oeste']",
      newTag: 'La Golondrina Oeste'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Daireaux',
      Agrozona: 'OBA - La Pampa',
      Campo: 'San Jose del Encuentro',
      oldTags: "['San Jose del Encuentro', 'San Jose Del Encuentro AO']",
      newTag: 'San Jose del Encuentro'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Daireaux',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Golondrina E',
      oldTags: "['La Golondrina E', 'La Golondrina O', 'La Golondrina Este']",
      newTag: 'La Golondrina Este'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Hipólito Yrigoyen',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Gure Etxea',
      oldTags: "['Gure Etxea', 'Gure Extea']",
      newTag: 'Gure Etxea'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'General Juan Madariaga',
      Agrozona: 'SE',
      Campo: 'La Loma',
      oldTags: "['La Loma', 'La loma']",
      newTag: 'La Loma'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'NBA-SSF',
      Campo: 'El Pehual',
      oldTags: "['El Pehual', 'El Pegual']",
      newTag: 'El Pehual'
    },
    {
      identifiers: 30635322140,
      companyName: 'Espartina S.A.',
      Localidad: 'Pergamino',
      Agrozona: 'NBA-SSF',
      Campo: 'San Federico II',
      oldTags: "['San Federico II', 'San Federico']",
      newTag: 'San Federico II'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Tala',
      Agrozona: 'Entre Rios',
      Campo: 'La Fraternidad',
      oldTags: "['La Fraternidad', 'La Fraternidd']",
      newTag: 'La Fraternidad'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Tala',
      Agrozona: 'Entre Rios',
      Campo: 'La Tenaza',
      oldTags: "['La Tenaza', 'La Tenza']",
      newTag: 'La Tenaza'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Tala',
      Agrozona: 'Entre Rios',
      Campo: 'La Tenza',
      oldTags: "['La Tenza', 'La Tenaza']",
      newTag: 'La Tenaza'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguay',
      Agrozona: 'Entre Rios',
      Campo: 'La Lita',
      oldTags: "['La Lita', 'La Lita ']",
      newTag: 'La Lita'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Uruguay',
      Agrozona: 'Entre Rios',
      Campo: 'La Soledad de Sergio',
      oldTags: "['La Soledad de Sergio', 'La Soledad II de Sergio']",
      newTag: 'La Soledad de Sergio'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Noemi',
      oldTags: "['La Noemi', 'La Noemí']",
      newTag: 'La Noemi'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Uruguay',
      Agrozona: 'Entre Rios',
      Campo: 'La Soledad de Juan',
      oldTags:
        "['La Soledad de Juan', 'La Soledad de Juan ', 'La Soledad II de Juan']",
      newTag: 'La Soledad de Juan '
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Nogoya',
      Agrozona: 'Entre Rios',
      Campo: 'El Sauce de Nogoya',
      oldTags: "['El Sauce de Nogoya', 'El Sauce Nogoya']",
      newTag: 'El Sauce Nogoya'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Nogoya',
      Agrozona: 'Entre Rios',
      Campo: 'El Sauce Nogoya',
      oldTags: "['El Sauce Nogoya', 'El Sauce de Nogoya', 'Sauce Nogoya']",
      newTag: 'El Sauce Nogoya'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguay',
      Agrozona: 'Entre Rios',
      Campo: 'El Retiro del Medio',
      oldTags: "['El Retiro del Medio', 'Retiro del medio']",
      newTag: 'El Retiro del Medio'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Nogoya',
      Agrozona: 'Entre Rios',
      Campo: 'Santa Ana',
      oldTags: "['Santa Ana', 'Santa Angela']",
      newTag: 'Santa Ana'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Victoria',
      Agrozona: 'Entre Rios',
      Campo: 'SAn Pedro Laguna del Pescado',
      oldTags:
        "['SAn Pedro Laguna del Pescado', 'San Pedro Laguna del Pescado', 'San Pedro Laguna del Pescador']",
      newTag: 'San Pedro Laguna Pescador'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'El Rincon',
      oldTags: "['El Rincon', 'El Rincon I', 'El Rincon II']",
      newTag: 'El Rincon I'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'El Rincon II',
      oldTags: "['El Rincon II', 'El Rincon I', 'El rincon II']",
      newTag: 'El Rincon II'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Nora',
      oldTags: "['La Nora', 'La Nona']",
      newTag: 'La Nora'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Haras Gualeyan',
      oldTags: "['Haras Gualeyan', 'Haraz Gualeyan']",
      newTag: 'Haras Gualeyan'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Los Zanjones de Jose',
      oldTags: "['Los Zanjones de Jose', 'Los Zanjones José']",
      newTag: 'Los zanjones de José'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Santa Angela',
      oldTags: "['Santa Angela', 'Sta Angela', 'Santa Ana']",
      newTag: 'Santa Angela'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Don Juan Messer',
      oldTags: "['Don Juan Messer', 'Don Juan Merser']",
      newTag: 'Don Juan Merser'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Nona',
      oldTags: "['La Nona', 'La Nora']",
      newTag: 'La Nona'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Victoria',
      Agrozona: 'Entre Rios',
      Campo: 'La Araucaria',
      oldTags: "['La Araucaria', 'Las Araucarias']",
      newTag: 'La Araucaria'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Nogoya',
      Agrozona: 'Entre Rios',
      Campo: 'La Marianita',
      oldTags: "['La Marianita', 'La Marita']",
      newTag: 'La Marianita'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Uruguay',
      Agrozona: 'Entre Rios',
      Campo: 'Los Maiten',
      oldTags: "['Los Maiten', 'Los Maiten ']",
      newTag: 'Los Maiten'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Don Juan (ex Doña Bet)',
      oldTags: "['Don Juan (ex Doña Bet)', 'Don Juan (ex Doña Bety)']",
      newTag: 'Don Juan (ex Doña Bety)'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Don Juan (ex Doña Bety)',
      oldTags: "['Don Juan (ex Doña Bety)', 'Don Juan (ex Doña Bet)']",
      newTag: 'Don Juan (ex Doña Bety)'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Marita',
      oldTags: "['La Marita', 'La Maria', 'La Marianita']",
      newTag: 'La Marita'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Cabaña',
      oldTags: "['La Cabaña', 'La Cabaña...']",
      newTag: 'La Cabaña'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'El Chana II',
      oldTags: "['El Chana II', 'El Chana I', 'El Chaná II']",
      newTag: 'El Chana II'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'El Chana I',
      oldTags: "['El Chana I', 'El Chana Ii', 'El Chana II']",
      newTag: 'El ChanaI'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Escondida de Larroque',
      oldTags: "['La Escondida de Larroque', 'La Escondida Larroque']",
      newTag: 'La Escondida de Larroque'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'San Sebastian',
      oldTags: "['San Sebastian', 'San Sebastian RBK']",
      newTag: 'San Sebastian RBK'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Uruguay',
      Agrozona: 'Entre Rios',
      Campo: 'La Atalaya',
      oldTags: "['La Atalaya', ' La Atalaya']",
      newTag: 'La Atalaya'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Uruguay',
      Agrozona: 'Entre Rios',
      Campo: 'La Maderiguera',
      oldTags: "['La Maderiguera', 'La Madriguera']",
      newTag: 'La Madriguera'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Uruguay',
      Agrozona: 'Entre Rios',
      Campo: 'La Atalaya',
      oldTags: "[' La Atalaya', 'La Atalaya']",
      newTag: 'La Atalaya '
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Uruguay',
      Agrozona: 'Entre Rios',
      Campo: 'La Madriguera',
      oldTags: "['La Madriguera', 'La Maderiguera']",
      newTag: 'La Madriguera'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Uruguay',
      Agrozona: 'Entre Rios',
      Campo: 'La Soledad II de Juan',
      oldTags:
        "['La Soledad II de Juan', 'La Soledad de Juan', 'La Soledad de Juan ']",
      newTag: 'La Soledad II de Juan'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Uruguay',
      Agrozona: 'Entre Rios',
      Campo: 'La Soledad II de Sergio',
      oldTags: "['La Soledad II de Sergio', 'La Soledad de Sergio']",
      newTag: 'La soledad II de Sergio'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Nogoya',
      Agrozona: 'Entre Rios',
      Campo: 'Sauce Nogoya',
      oldTags: "['Sauce Nogoya', 'Sauce Nogoya ', 'El Sauce Nogoya']",
      newTag: 'Sauce Nogoya'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'El rincon II',
      oldTags: "['El rincon II', 'El Rincon II', 'El Rincon I']",
      newTag: 'El rincon II'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Sta Angela',
      oldTags: "['Sta Angela', 'Santa Angela']",
      newTag: 'Santa Angela'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Haraz Gualeyan',
      oldTags: "['Haraz Gualeyan', 'Haras Gualeyan']",
      newTag: 'Haraz Gualeyan'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Victoria',
      Agrozona: 'Entre Rios',
      Campo: 'San Pedro Laguna Pescador',
      oldTags:
        "['San Pedro Laguna Pescador', 'San Pedro Laguna Pescador ', 'San Pedro Laguna del Pescador']",
      newTag: 'San Pedro Laguna Pescador'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'El Chana Ii',
      oldTags: "['El Chana Ii', 'El Chana I', 'El Chana II']",
      newTag: 'El chana II'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'San Marcos',
      oldTags: "['San Marcos', 'San Marcos ']",
      newTag: 'San Marcos'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'San Marcos',
      oldTags: "['San Marcos ', 'San Marcos']",
      newTag: 'San Marcos'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Maria',
      oldTags: "['La Maria', 'La Marita']",
      newTag: 'La Maria'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'San Sebastian RBK',
      oldTags: "['San Sebastian RBK', 'San Sebastian']",
      newTag: 'San Sebastian RBK'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'El Rincon I',
      oldTags: "['El Rincon I', 'El Rincon II', 'El Rincon']",
      newTag: 'El rincon I'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Victoria',
      Agrozona: 'Entre Rios',
      Campo: 'San Pedro Laguna del Pescador',
      oldTags:
        "['San Pedro Laguna del Pescador', 'San Pedro Laguna del Pescado', 'SAn Pedro Laguna del Pescado']",
      newTag: 'San Pedro Laguna Pescador'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Don Juan',
      oldTags: "['Don Juan', 'Don Juan ']",
      newTag: 'Don Juan'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Rosita',
      oldTags: "['La Rosita', 'La Rosita ', 'La Rosita...']",
      newTag: 'La Rosita'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'El Chaná II',
      oldTags: "['El Chaná II', 'El Chaná I', 'El Chana II']",
      newTag: 'El Chana II'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'El Chaná I',
      oldTags: "['El Chaná I', 'El Chaná II', 'El Chana I']",
      newTag: 'El Chana I'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Uruguay',
      Agrozona: 'Entre Rios',
      Campo: 'Los Maiten',
      oldTags: "['Los Maiten ', 'Los Maiten']",
      newTag: 'Los Maiten'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Noemí',
      oldTags: "['La Noemí', 'La Noemi']",
      newTag: 'La Noemi'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Victoria',
      Agrozona: 'Entre Rios',
      Campo: 'Las Araucarias',
      oldTags: "['Las Araucarias', 'La Araucaria']",
      newTag: 'Las Araucarias'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Don Juan Merser',
      oldTags: "['Don Juan Merser', 'Don Juan Messer']",
      newTag: 'Don Juan Merser'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Los Zanjones José',
      oldTags: "['Los Zanjones José', 'Los Zanjones de Jose']",
      newTag: 'Los Zanjones de José'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Tala',
      Agrozona: 'Entre Rios',
      Campo: 'La Fraternidd',
      oldTags: "['La Fraternidd', 'La Fraternidad']",
      newTag: 'La Fraternidad'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'Don Juan',
      oldTags: "['Don Juan ', 'Don Juan']",
      newTag: 'Don Juan'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Escondida Larroque',
      oldTags: "['La Escondida Larroque', 'La Escondida de Larroque']",
      newTag: 'La Escondida de Larroque'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Victoria',
      Agrozona: 'Entre Rios',
      Campo: 'San Pedro Laguna del Pescado',
      oldTags:
        "['San Pedro Laguna del Pescado', 'San Pedro Laguna del Pescador', 'SAn Pedro Laguna del Pescado']",
      newTag: 'San Pedro Laguna Pescador'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguay',
      Agrozona: 'Entre Rios',
      Campo: 'Retiro del medio',
      oldTags: "['Retiro del medio', 'El Retiro del Medio']",
      newTag: 'El Retiro del Medio'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'El Chaná',
      oldTags: "['El Chaná', 'El Chaná I']",
      newTag: 'El Chaná '
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Rosita',
      oldTags: "['La Rosita ', 'La Rosita']",
      newTag: 'La Rosita'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Uruguay',
      Agrozona: 'Entre Rios',
      Campo: 'La Soledad de Juan',
      oldTags:
        "['La Soledad de Juan ', 'La Soledad de Juan', 'La Soledad II de Juan']",
      newTag: 'La Soledad de Juan'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Victoria',
      Agrozona: 'Entre Rios',
      Campo: 'San Pedro Laguna Pescador',
      oldTags:
        "['San Pedro Laguna Pescador ', 'San Pedro Laguna Pescador', 'San Pedro Laguna del Pescador']",
      newTag: 'San Pedro Laguna Pescador'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguay',
      Agrozona: 'Entre Rios',
      Campo: 'La Lita',
      oldTags: "['La Lita ', 'La Lita']",
      newTag: 'La Lita'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Nogoya',
      Agrozona: 'Entre Rios',
      Campo: 'Sauce Nogoya',
      oldTags: "['Sauce Nogoya ', 'Sauce Nogoya', 'El Sauce Nogoya']",
      newTag: 'Sauce Nogoya'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Rosita...',
      oldTags: "['La Rosita...', 'La Rosita']",
      newTag: 'La Cabaña'
    },
    {
      identifiers: 30638195662,
      companyName: 'BERARDO AGROPECUARIA SRL',
      Localidad: 'Gualeguaychú',
      Agrozona: 'Entre Rios',
      Campo: 'La Cabaña...',
      oldTags: "['La Cabaña...', 'La Cabaña']",
      newTag: 'La Cabaña'
    },
    {
      identifiers: 30682628533,
      companyName: 'KAIZEN S.A.',
      Localidad: 'Presidente Roque Sáenz Peña',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Kaizen S.A.',
      oldTags: "['Kaizen S.A.', 'Kaizen SA']",
      newTag: 'Kaizen'
    },
    {
      identifiers: 30682628533,
      companyName: 'KAIZEN S.A.',
      Localidad: 'Presidente Roque Sáenz Peña',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Kaizen SA',
      oldTags: "['Kaizen SA', 'Kaizen S.A.']",
      newTag: 'Kaizen'
    },
    {
      identifiers: 30687028526,
      companyName: 'Sucesores de Leandro D Forzani S.A.',
      Localidad: 'San Justo',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Los Porteños',
      oldTags: "['Los Porteños', 'Los Porteños.', 'Los Porteños---']",
      newTag: 'Los Porteños'
    },
    {
      identifiers: 30687028526,
      companyName: 'Sucesores de Leandro D Forzani S.A.',
      Localidad: 'San Justo',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Los Porteños---',
      oldTags: "['Los Porteños---', 'Los Porteños', 'Los Porteños.']",
      newTag: 'Los Porteños'
    },
    {
      identifiers: 30687028526,
      companyName: 'Sucesores de Leandro D Forzani S.A.',
      Localidad: 'San Justo',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Los Porteños.',
      oldTags: "['Los Porteños.', 'Los Porteños', 'Los Porteños---']",
      newTag: 'Los Porteños'
    },
    {
      identifiers: 30694251273,
      companyName: 'TECNOCAMPO S.A.',
      Localidad: 'Río Cuarto',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'TC116 - Porvenir',
      oldTags: "['TC116 - Porvenir', 'TC116 - El Porvenir']",
      newTag: 'TC116 - El Porvenir'
    },
    {
      identifiers: 30694251273,
      companyName: 'TECNOCAMPO S.A.',
      Localidad: 'Río Cuarto',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'TC116 - El Porvenir',
      oldTags: "['TC116 - El Porvenir', 'TC116 - Porvenir']",
      newTag: 'TC116 - El Porvenir'
    },
    {
      identifiers: 30708155337,
      companyName: 'DON PLACIDO S.A.',
      Localidad: 'Río Seco',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Gutenberg',
      oldTags: "['Gutenberg', 'Gutemberg', 'Gutemberg']",
      newTag: 'Gutemberg'
    },
    {
      identifiers: 30708166479,
      companyName: 'HIJOS DE LORENZO BRUNOTTO S.A.',
      Localidad: 'San Justo',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Campo Don Lorenzo',
      oldTags: "['Campo Don Lorenzo ', 'Campo Don Lorenzo']",
      newTag: 'Don Lorenzo'
    },
    {
      identifiers: 30708166479,
      companyName: 'HIJOS DE LORENZO BRUNOTTO S.A.',
      Localidad: 'San Justo',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Campo Don Lorenzo',
      oldTags: "['Campo Don Lorenzo', 'Campo Don Lorenzo ']",
      newTag: 'Don Lorenzo'
    },
    {
      identifiers: 30708166479,
      companyName: 'HIJOS DE LORENZO BRUNOTTO S.A.',
      Localidad: 'San Justo',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Campo Pozo del Avestruz',
      oldTags: "['Campo Pozo del Avestruz', 'Campo Pozo del Avestruz ']",
      newTag: 'Pozo del Avestruz'
    },
    {
      identifiers: 30708166479,
      companyName: 'HIJOS DE LORENZO BRUNOTTO S.A.',
      Localidad: 'San Justo',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'Campo Pozo del Avestruz',
      oldTags: "['Campo Pozo del Avestruz ', 'Campo Pozo del Avestruz']",
      newTag: 'Pozo del Avestruz'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      Localidad: 'Moreno',
      Agrozona: 'NEA',
      Campo: 'DON FELIX',
      oldTags: "['DON FELIX', 'DON FÉLIX']",
      newTag: 'DON FELIX'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      Localidad: 'Juan F. Ibarra',
      Agrozona: 'NEA',
      Campo: 'GRINGA 1',
      oldTags: "['GRINGA 1', 'GRINGA 2']",
      newTag: 'GRINGA 1'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      Localidad: 'Juan F. Ibarra',
      Agrozona: 'NEA',
      Campo: 'GRINGA 2',
      oldTags: "['GRINGA 2', 'GRINGA 1']",
      newTag: 'GRINGA 2'
    },
    {
      identifiers: 30708500921,
      companyName: 'MAYTOM AGROINVERSIONES SOCIEDAD ANONIMA',
      Localidad: 'Moreno',
      Agrozona: 'NEA',
      Campo: 'DON FÉLIX',
      oldTags: "['DON FÉLIX', 'DON FELIX']",
      newTag: 'DON FELIX'
    },
    {
      identifiers: 30708930543,
      companyName: 'MAT WIL SRL',
      Localidad: 'Aguirre',
      Agrozona: 'NEA',
      Campo: 'San Jose',
      oldTags: "['San Jose', 'San Jose.']",
      newTag: 'San Jose'
    },
    {
      identifiers: 30708930543,
      companyName: 'MAT WIL SRL',
      Localidad: 'Aguirre',
      Agrozona: 'NEA',
      Campo: 'San Jose.',
      oldTags: "['San Jose.', 'San Jose']",
      newTag: 'San Jose'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Presidente Roque Sáenz Peña',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'La Maria',
      oldTags: "['La Maria', 'La Maria 2']",
      newTag: 'La Maria'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'Los Baguales',
      oldTags: "['Los Baguales ', 'Los Baguales']",
      newTag: 'Los Baguales'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'General Arenales',
      Agrozona: 'NBA-SSF',
      Campo: 'La Cora',
      oldTags: "['La Cora ', 'La Cora']",
      newTag: 'La Cora'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'Fortin Chico',
      oldTags: "['Fortin Chico ', 'Fortin Chico']",
      newTag: 'Fortin Chico'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Santa María',
      oldTags: "['Santa María', 'Santa Maria', 'Santa Maria ']",
      newTag: 'Santa María'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Carlos Tejedor',
      Agrozona: 'NBA-SSF',
      Campo: 'La Alejandrina',
      oldTags: "['La Alejandrina ', 'La Alejandrina', 'La Alejandrinaa']",
      newTag: 'La Alejandrina'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Rivadavia',
      Agrozona: 'NBA-SSF',
      Campo: 'La Marianita',
      oldTags: "['La Marianita', 'La Marianita ']",
      newTag: 'La Marianita'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'Fortin Chico',
      oldTags: "['Fortin Chico', 'Fortin Chico ']",
      newTag: 'Fortin Chico'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Santa Maria',
      oldTags: "['Santa Maria ', 'Santa Maria', 'Santa María']",
      newTag: 'Santa Maria'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'NBA-SSF',
      Campo: 'Tres Bonetes',
      oldTags: "['Tres Bonetes', 'Tres Bonetess']",
      newTag: 'Tres Bonetes'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'NBA-SSF',
      Campo: 'Santa Catalina',
      oldTags: "['Santa Catalina ', 'Santa Catalinaa']",
      newTag: 'Santa Catalina'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'San Alberto',
      oldTags: "['San Alberto ', 'San Alberto']",
      newTag: 'San Alberto'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Rivadavia',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Vasca',
      oldTags: "['La Vasca ', 'La Vasca']",
      newTag: 'La Vasca'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Rivadavia',
      Agrozona: 'NBA-SSF',
      Campo: 'La Marianita',
      oldTags: "['La Marianita ', 'La Marianita']",
      newTag: 'La Marianita'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Carlos Tejedor',
      Agrozona: 'NBA-SSF',
      Campo: 'La Alejandrina',
      oldTags: "['La Alejandrina', 'La Alejandrinaa', 'La Alejandrina ']",
      newTag: 'La Alejandrina'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'Los Baguales',
      oldTags: "['Los Baguales', 'Los Baguales ']",
      newTag: 'Los Baguales'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Rivadavia',
      Agrozona: 'OBA - La Pampa',
      Campo: 'La Vasca',
      oldTags: "['La Vasca', 'La Vasca ']",
      newTag: 'La Vasca'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'San Alberto',
      oldTags: "['San Alberto', 'San Alberto ']",
      newTag: 'San Alberto'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Tandil',
      Agrozona: 'SE',
      Campo: 'San German',
      oldTags: "['San German ', 'San German']",
      newTag: 'San German'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Tandil',
      Agrozona: 'SE',
      Campo: 'San German',
      oldTags: "['San German', 'San German ']",
      newTag: 'San German'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Carlos Tejedor',
      Agrozona: 'NBA-SSF',
      Campo: 'La Alejandrinaa',
      oldTags: "['La Alejandrinaa', 'La Alejandrina', 'La Alejandrina ']",
      newTag: 'La Alejandrina'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'NBA-SSF',
      Campo: 'Tres Bonetess',
      oldTags: "['Tres Bonetess', 'Tres Bonetes']",
      newTag: 'Tres Bonetes'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'Santa Paulaa',
      oldTags: "['Santa Paulaa', 'Santa Paula']",
      newTag: 'Santa Paula'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'NBA-SSF',
      Campo: 'Santa Catalinaa',
      oldTags: "['Santa Catalinaa', 'Santa Catalina ']",
      newTag: 'Santa Catalina'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Lincoln',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Santa Maria',
      oldTags: "['Santa Maria', 'Santa Maria ', 'Santa María']",
      newTag: 'Santa Maria'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'General Arenales',
      Agrozona: 'NBA-SSF',
      Campo: 'La Cora',
      oldTags: "['La Cora', 'La Cora ']",
      newTag: 'La Cora'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'General Villegas',
      Agrozona: 'NBA-SSF',
      Campo: 'Santa Paula',
      oldTags: "['Santa Paula', 'Santa Paulaa']",
      newTag: 'Santa Paula'
    },
    {
      identifiers: 30709191310,
      companyName: 'Cazenave y Asociados Fiduciaria S.A.',
      Localidad: 'Presidente Roque Sáenz Peña',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'La Maria 2',
      oldTags: "['La Maria 2', 'La Maria']",
      newTag: 'La Maria 2'
    },
    {
      identifiers: 30711119430,
      companyName: 'LA ESTRELLA LAUQUEN S.R.L.',
      Localidad: 'Trenque Lauquen',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Vuelta Al Pago',
      oldTags: "['Vuelta Al Pago', 'Vuelta al Pago']",
      newTag: 'Vuelta Al Pago'
    },
    {
      identifiers: 30711119430,
      companyName: 'LA ESTRELLA LAUQUEN S.R.L.',
      Localidad: 'Trenque Lauquen',
      Agrozona: 'OBA - La Pampa',
      Campo: 'Vuelta al Pago',
      oldTags: "['Vuelta al Pago', 'Vuelta Al Pago']",
      newTag: 'Vuelta Al Pago'
    },
    {
      identifiers: 30714249386,
      companyName: 'MISURA S.R.L',
      Localidad: 'Tala',
      Agrozona: 'Entre Rios',
      Campo: 'Don Renzo',
      oldTags: "['Don Renzo', 'Don Renzo ']",
      newTag: 'Don Renzo'
    },
    {
      identifiers: 30714249386,
      companyName: 'MISURA S.R.L',
      Localidad: 'Tala',
      Agrozona: 'Entre Rios',
      Campo: 'Los Robles',
      oldTags: "['Los Robles', 'Los Robless']",
      newTag: 'Los Robles'
    },
    {
      identifiers: 30714249386,
      companyName: 'MISURA S.R.L',
      Localidad: 'Tala',
      Agrozona: 'Entre Rios',
      Campo: 'Don Renzo',
      oldTags: "['Don Renzo ', 'Don Renzo']",
      newTag: 'Don Renzo'
    },
    {
      identifiers: 30714249386,
      companyName: 'MISURA S.R.L',
      Localidad: 'Tala',
      Agrozona: 'Entre Rios',
      Campo: 'Los Robless',
      oldTags: "['Los Robless', 'Los Robles']",
      newTag: 'Los Robles'
    },
    {
      identifiers: 30715361848,
      companyName: 'Gensus S.A.',
      Localidad: 'Junín',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'C3-Guazuncho 4-Gensus-60Has',
      oldTags:
        "['C3-Guazuncho 4-Gensus-60Has', 'C4-Guazuncho 4-Gensus-60Has', ' C6-Guazuncho4-Gensus-60Ha']",
      newTag: null
    },
    {
      identifiers: 30715361848,
      companyName: 'Gensus S.A.',
      Localidad: 'Junín',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'C4-Guazuncho 4-Gensus-60Has',
      oldTags:
        "['C4-Guazuncho 4-Gensus-60Has', 'C3-Guazuncho 4-Gensus-60Has', ' C6-Guazuncho4-Gensus-60Ha']",
      newTag: null
    },
    {
      identifiers: 30715361848,
      companyName: 'Gensus S.A.',
      Localidad: 'Junín',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'C5-Guazuncho 4-Gensus-55Has',
      oldTags:
        "[' C5-Guazuncho 4-Gensus-55Has', 'C4-Guazuncho 4-Gensus-60Has', 'C3-Guazuncho 4-Gensus-60Has']",
      newTag: null
    },
    {
      identifiers: 30715361848,
      companyName: 'Gensus S.A.',
      Localidad: 'Junín',
      Agrozona: 'Cordoba - San Luis',
      Campo: 'C6-Guazuncho4-Gensus-60Ha',
      oldTags:
        "[' C6-Guazuncho4-Gensus-60Ha', 'C4-Guazuncho 4-Gensus-60Has', 'C3-Guazuncho 4-Gensus-60Has']",
      newTag: null
    },
    {
      identifiers: 30715791893,
      companyName: 'TERREGAL',
      Localidad: 'Chapaleufú',
      Agrozona: 'OBA - La Pampa',
      Campo: 'El medano',
      oldTags: "['El medano', 'El medano 2']",
      newTag: 'El Medano'
    },
    {
      identifiers: 30715791893,
      companyName: 'TERREGAL',
      Localidad: 'Maracó',
      Agrozona: 'OBA - La Pampa',
      Campo: 'El medano 2',
      oldTags: "['El medano 2', 'El medano']",
      newTag: 'El Medano 2'
    },
    {
      identifiers: 30716775395,
      companyName: 'CAPITANICH AGROPECUARIA SAS',
      Localidad: 'Independencia',
      Agrozona: 'NEA',
      Campo: 'Gurincho',
      oldTags: "['Gurincho', 'gurincho']",
      newTag: 'Gurincho'
    },
    {
      identifiers: 30716775395,
      companyName: 'CAPITANICH AGROPECUARIA SAS',
      Localidad: 'Independencia',
      Agrozona: 'NEA',
      Campo: 'gurincho',
      oldTags: "['gurincho', 'Gurincho']",
      newTag: 'Gurincho'
    },
    {
      identifiers: 33707173179,
      companyName: 'ESKEL S A',
      Localidad: 'San Lorenzo',
      Agrozona: 'Entre Rios',
      Campo: 'Fortin Timbo',
      oldTags: "['Fortin Timbo', 'Fortín Timbo ']",
      newTag: 'Fortín Timbo'
    },
    {
      identifiers: 33707173179,
      companyName: 'ESKEL S A',
      Localidad: '9 de Julio',
      Agrozona: null,
      Campo: 'La Josefina',
      oldTags: "['La Josefina', 'La Josefina ']",
      newTag: 'La Josefina'
    },
    {
      identifiers: 33707173179,
      companyName: 'ESKEL S A',
      Localidad: 'San Jerónimo',
      Agrozona: 'NBA-SSF',
      Campo: 'La Tita',
      oldTags: "['La Tita', 'La Tita ']",
      newTag: 'La Tita'
    },
    {
      identifiers: 33707173179,
      companyName: 'ESKEL S A',
      Localidad: 'San Jerónimo',
      Agrozona: 'NBA-SSF',
      Campo: 'La Tita',
      oldTags: "['La Tita ', 'La Tita']",
      newTag: 'La Tita'
    },
    {
      identifiers: 33707173179,
      companyName: 'ESKEL S A',
      Localidad: 'San Lorenzo',
      Agrozona: 'Entre Rios',
      Campo: 'Fortín Timbo',
      oldTags: "['Fortín Timbo ', 'Fortin Timbo']",
      newTag: 'Fortín Timbo'
    },
    {
      identifiers: 33707173179,
      companyName: 'ESKEL S A',
      Localidad: '9 de Julio',
      Agrozona: null,
      Campo: 'La Josefina',
      oldTags: "['La Josefina ', 'La Josefina']",
      newTag: 'La Josefina'
    },
    {
      identifiers: 55000002126,
      companyName: 'EmpresaProduccionEEUU',
      Localidad: 'Moreno',
      Agrozona: null,
      Campo: 'San Marcos USA',
      oldTags: "['San Marcos USA', 'San marcos USA']",
      newTag: null
    },
    {
      identifiers: 55000002126,
      companyName: 'EmpresaProduccionEEUU',
      Localidad: 'Moreno',
      Agrozona: null,
      Campo: 'San marcos USA',
      oldTags: "['San marcos USA', 'San Marcos USA']",
      newTag: null
    }
  ]
}
