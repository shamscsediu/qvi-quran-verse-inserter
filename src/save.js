import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Dashicon } from '@wordpress/components';
export default function Save( { attributes } ) {
	const blockProps = useBlockProps.save();

	return (
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
			<div
				style={ {
					display: 'flex',
					alignItems: 'top',
					justifyContent: 'start',
					fontStyle: 'italic',
				} }
			>
				<Dashicon icon="format-quote" />

				<RichText.Content
					{ ...blockProps }
					className="qvi-translation"
					tagName="p"
					value={ attributes.translation }
				/>
			</div>

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
	);
}
