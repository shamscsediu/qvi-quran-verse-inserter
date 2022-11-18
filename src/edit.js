import {
	InspectorControls,
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	Button,
	SelectControl,
	Dashicon,
	FlexItem,
	FlexBlock,
	Flex,
	ToggleControl,
} from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

import './editor.scss';
import { genarateVerseOptions, splitData } from './helpers/utility';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const [ loading, setLoading ] = useState( false );
	const { createErrorNotice } = useDispatch( noticesStore );

	const [ surahOptions, setSurahOptions ] = useState( null );
	const [ verseOptions, setVerseOptions ] = useState( [] );
	const [ translationOptions, setTranslationOptions ] = useState( [] );

	useEffect( () => {
		fetchSurahs();
	}, [] );
	useEffect( () => {
		fetchTranslations();
	}, [] );
	useEffect( () => {
		setVerseOptions( [] );
		setVerseOptions( genarateVerseOptions( attributes.surahNumber ) );
	}, [] );

	/**
	 * @function fetchSurahs
	 * @description fetching Surah Meta Info from the api
	 * and then assign to options
	 */
	const fetchSurahs = async () => {
		await fetch( 'http://api.alquran.cloud/v1/meta' )
			.then( ( response ) => response.json() )
			.then( ( response ) => {
				const data = response.data.surahs.references;
				const obj = [];
				data.map( ( surah ) => {
					return obj.push( {
						label: surah.number + '. ' + surah.englishName,
						value: surah.number + ':' + surah.numberOfAyahs,
					} );
				} );
				setSurahOptions( obj );
			} )
			.catch( () => {
				createErrorNotice( 'An error occurred! Please try again', {
					type: 'snackbar',
					explicitDismiss: true,
				} );
			} );
	};

	/**
	 * @function fetchTranslations
	 * @description fetching Surah translation editions from the api
	 * and then assign to options
	 */
	const fetchTranslations = () => {
		fetch( 'http://api.alquran.cloud/v1/edition/type/translation' )
			.then( ( response ) => response.json() )
			.then( ( response ) => {
				const data = response.data;
				const obj = [];
				data.map( ( translate ) => {
					return obj.push( {
						label:
							translate.language.toUpperCase() +
							'-' +
							translate.englishName,
						value: translate.identifier,
					} );
				} );
				setTranslationOptions( obj );
			} )
			.catch( () => {
				createErrorNotice( 'An error occurred! Please try again', {
					type: 'snackbar',
					explicitDismiss: true,
				} );
			} );
	};

	/**
	 * @function handleSurahNumberChange
	 * @description will handle surah number while change upon selection
	 * @param {string} selectedSurah 'meta info of selected surah'
	 */
	const handleSurahNumberChange = ( selectedSurah ) => {
		setAttributes( { surahNumber: selectedSurah } );
		setVerseOptions( [] );
		setAttributes( { verseNumber: 1 } );
		setVerseOptions( genarateVerseOptions( selectedSurah ) );
	};

	/**
	 * @function fetchVerseArabicText
	 * @description fetch the verse arabic text
	 * @param {Array} verseMeta meta info of surah and verse
	 */
	const fetchVerseArabicText = async ( verseMeta ) => {
		await fetch(
			'https://api.alquran.cloud/v1/ayah/' +
				verseMeta[ 0 ] +
				':' +
				attributes.verseNumber
		)
			.then( ( res ) => res.json() )
			.then( ( res ) => {
				setAttributes( { arabicAyat: res.data.text } );
				setLoading( false );
			} )
			.catch( () => {
				setLoading( false );
				createErrorNotice( 'An error occurred! Please try again', {
					type: 'snackbar',
					explicitDismiss: true,
				} );
			} );
	};

	/**
	 * @function getQuranVerse
	 * @description get the verse of the quran with arabic ayat and translation
	 */
	const getQuranVerse = async () => {
		try {
			setLoading( true );
			const verseMeta = splitData( attributes.surahNumber, ':', 2 );
			setAttributes( {
				surahRef:
					'[' + verseMeta[ 0 ] + ':' + attributes.verseNumber + ']',
			} );
			await fetch(
				'http://api.alquran.cloud/v1/ayah/' +
					verseMeta[ 0 ] +
					':' +
					attributes.verseNumber +
					'/' +
					attributes.translationIdentifier
			)
				.then( ( res ) => res.json() )
				.then( ( res ) => {
					setAttributes( { translation: res.data.text } );
					fetchVerseArabicText( verseMeta );
					setLoading( false );
				} )
				.catch( () => {
					setLoading( false );
					createErrorNotice( 'An error occurred! Please try again', {
						type: 'snackbar',
						explicitDismiss: true,
					} );
				} )
				.finally( () => {
					setLoading( false );
				} );
		} catch ( error ) {
			createErrorNotice( 'An error occurred! Please try again', {
				type: 'snackbar',
				explicitDismiss: true,
			} );
		}
	};
	if ( ! surahOptions ) return null;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Quran Verse Settings" initialOpen={ true }>
					<PanelRow>
						<SelectControl
							label="Surah"
							value={ attributes.surahNumber }
							options={ surahOptions }
							onChange={ ( number ) =>
								handleSurahNumberChange( number )
							}
							__nextHasNoMarginBottom
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label="Verse"
							value={ attributes.verseNumber }
							options={ verseOptions }
							onChange={ ( verse ) =>
								setAttributes( { verseNumber: verse } )
							}
							__nextHasNoMarginBottom
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label="Translation"
							value={ attributes.translationIdentifier }
							options={ translationOptions }
							onChange={ ( translate ) =>
								setAttributes( {
									translationIdentifier: translate,
								} )
							}
							__nextHasNoMarginBottom
						/>
					</PanelRow>

					<PanelRow>
						<Button
							onClick={ getQuranVerse }
							variant="primary"
							isBusy={ loading }
							disabled={ loading }
						>
							Get verse
						</Button>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Show Only Translation"
							help={
								attributes.showOnlyTranslation
									? 'Showing only translation.'
									: 'Showing all.'
							}
							checked={ attributes.showOnlyTranslation }
							onChange={ ( state ) => {
								setAttributes( {
									showOnlyTranslation: state,
								} );
							} }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ ! attributes.showOnlyTranslation && (
					<RichText.Content
						{ ...blockProps }
						tagName="p"
						className="qvi-arabic-ayat"
						style={ {
							direction: 'rtl',
							textAlign: 'right',
							lineHeight: '2.5em',
							fontSize: '1.4em',
							fontFamily: 'Alqalam',
						} }
						value={ attributes.arabicAyat }
					/>
				) }
				<Flex
					gap={ 2 }
					align="top"
					alignItems="top"
					justify="space-between"
				>
					{ attributes.translation && (
						<FlexItem>
							<Dashicon icon="format-quote" />
						</FlexItem>
					) }
					<FlexBlock style={ { fontStyle: 'italic' } }>
						<RichText.Content
							{ ...blockProps }
							className="qvi-translation"
							tagName="p"
							value={ attributes.translation }
						/>
					</FlexBlock>
				</Flex>

				<RichText.Content
					tagName="p"
					{ ...blockProps }
					className="qvi-surah-ref"
					style={ {
						textAlign: 'right',
						fontFamily: 'sans-serif',
						fontStyle: 'italic',
						fontSize: '.8em',
					} }
					value={ attributes.surahRef }
				/>
			</div>
		</>
	);
}
