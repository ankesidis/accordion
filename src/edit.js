/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { Button, PanelBody, ToggleControl, FontSizePicker, ToolbarGroup, ToolbarButton, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { arrowUp, arrowDown, trash } from '@wordpress/icons';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {

	const { items = [], collapsed = true, isFAQ = false, descriptionColor, descriptionFontSize, descriptionFontFamily } = attributes;
    const blockProps = useBlockProps();
    const [activeIndex, setActiveIndex] = useState( null );

    const addItem = () => {
        const newItems = [ ...items, { id: Date.now().toString(), title: 'New Item', content: '' } ];
        setAttributes( { items: newItems } );
    };

    const removeItem = (index) => {
        const newItems = items.filter( ( _, i ) => i !== index );
        setAttributes( { items: newItems } );
    };

    const updateItem = (index, key, value) => {
        const newItems = items.map( ( item, i ) => {
            if ( i === index ) {
                return { ...item, [ key ]: value };
            }
            return item;
        } );
        setAttributes( { items: newItems } );
    };

    const toggleItem = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const moveItem = (fromIndex, toIndex) => {
        if (toIndex >= 0 && toIndex < items.length) {
            const newItems = [...items];
            const [movedItem] = newItems.splice(fromIndex, 1);
            newItems.splice(toIndex, 0, movedItem);
            setAttributes({ items: newItems });
        }
    };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title="Settings">
                    <ToggleControl
                        label="Collapse by default"
                        checked={collapsed}
                        onChange={(value) => setAttributes({ collapsed: value })}
                    />
                    <ToggleControl
                        label="Mark as FAQ"
                        checked={isFAQ}
                        onChange={(value) => setAttributes({ isFAQ: value })}
                    />
                </PanelBody>
                <PanelColorSettings
                    title="Description Color"
                    initialOpen={false}
                    colorSettings={[
                        {
                            value: descriptionColor,
                            onChange: (color) => setAttributes({ descriptionColor: color }),
                            label: 'Text Color'
                        }
                    ]}
                />
                <PanelBody title="Typography Settings" initialOpen={false}>
                    <FontSizePicker
                        value={descriptionFontSize}
                        onChange={(size) => setAttributes({ descriptionFontSize: size })}
                    />
                    <TextControl
                        label="Font Family"
                        value={descriptionFontFamily}
                        onChange={(family) => setAttributes({ descriptionFontFamily: family })}
                    />
                </PanelBody>
            </InspectorControls>
            <div className="accordion">
                {items.map((item, index) => (
                    <div className={`accordion-item ${activeIndex === index ? 'expanded' : ''}`} key={item.id}>
                        <div className="accordion-header">
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItem(index, 'title', e.target.value)}
                                placeholder="Title"
                                onClick={() => toggleItem(index)}
                                aria-expanded={activeIndex === index}
                            />
                            <ToolbarGroup>
                                <ToolbarButton
                                    icon={arrowUp}
                                    label="Move up"
                                    onClick={() => moveItem(index, index - 1)}
                                    disabled={index === 0}
                                />
                                <ToolbarButton
                                    icon={arrowDown}
                                    label="Move down"
                                    onClick={() => moveItem(index, index + 1)}
                                    disabled={index === items.length - 1}
                                />
                                <ToolbarButton
                                    icon={trash}
                                    label="Remove"
                                    onClick={() => removeItem(index)}
                                    isDestructive
                                />
                            </ToolbarGroup>
                        </div>
                        <div className={`accordion-content ${activeIndex === index ? 'is-open' : ''}`} style={{
                            color: descriptionColor,
                            fontSize: `${descriptionFontSize}px`,
                            fontFamily: descriptionFontFamily
                        }}>
                            <RichText
                                tagName="p"
                                value={item.content}
                                onChange={(value) => updateItem(index, 'content', value)}
                                placeholder="Add your content here"
                                style={{
                                    color: descriptionColor,
                                    fontSize: `${descriptionFontSize}px`,
                                    fontFamily: descriptionFontFamily
                                }}
                            />
                        </div>
                    </div>
                ))}
                <Button onClick={addItem} variant="primary">Add Item</Button>
            </div>
        </div>
    );
}
