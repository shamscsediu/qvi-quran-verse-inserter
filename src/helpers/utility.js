/**
 * @function splitData
 * @description split the data with a separator and genarates array
 * @param {string} data  the string to be splited
 * @param {string} sep   separator
 * @param {number} limit how many split of the separation
 * @return {Array} returns array holding surah number and verse count
 */
export const splitData = ( data, sep, limit ) => {
	return data.split( sep, limit );
};

/**
 *
 * @function genarateVerseOptions
 * @description genarates the verse options for the total count of verse for a surah
 * @param {string} verseCountMeta holds the surah number and total verse count ex. 1:7
 * @return {Array} returns array of verse options object
 */
export const genarateVerseOptions = ( verseCountMeta ) => {
	const verseMeta = splitData( verseCountMeta, ':', 2 );
	const obj = [];
	for ( let i = 1; i <= verseMeta[ 1 ]; i++ ) {
		obj.push( { label: 'Verse ' + i, value: i } );
	}
	return obj;
};
