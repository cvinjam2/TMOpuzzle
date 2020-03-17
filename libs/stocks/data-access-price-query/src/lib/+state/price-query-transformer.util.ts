import { PriceQuery, PriceQueryResponse } from './price-query.type';
import { map, pick } from 'lodash-es';
import { parse } from 'date-fns';

export function transformPriceQueryResponse(
  response: PriceQueryResponse[], fromDateNumeric: number, toDateNumeric: number
): PriceQuery[] {
  const data =  map(
    response,
    responseItem =>
      ({
        ...pick(responseItem, [
          'date',
          'open',
          'high',
          'low',
          'close',
          'volume',
          'change',
          'changePercent',
          'label',
          'changeOverTime'
        ]),
        dateNumeric: parse(responseItem.date).getTime()
      } as PriceQuery)
  );
  // filtering based on from and to dates.
  return data.filter((result) => {
    return (result.dateNumeric >= fromDateNumeric) && (result.dateNumeric <= toDateNumeric)
  });
}
