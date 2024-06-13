/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {

	const { items = [], collapsed = true, isFAQ = false, descriptionColor, descriptionFontSize, descriptionFontFamily } = attributes;
    const blockProps = useBlockProps.save();

    return (
        <div {...blockProps} data-faq={isFAQ}>
            <div className="accordion">
                {items.map((item) => (
                    <div className={`accordion-item ${collapsed ? 'collapsed' : 'expanded'}`} key={item.id}>
                        <button
                            className="accordion-header"
                            aria-expanded={!collapsed}
                        >
                            {item.title}
                        </button>
                        <div className={`accordion-content ${!collapsed ? 'is-open' : ''}`} style={{
                            color: descriptionColor,
                            fontSize: `${descriptionFontSize}px`,
                            fontFamily: descriptionFontFamily
                        }}>
                            <RichText.Content
                                tagName="p"
                                value={item.content}
                                style={{
                                    color: descriptionColor,
                                    fontSize: `${descriptionFontSize}px`,
                                    fontFamily: descriptionFontFamily
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}
