<?php
/**
 * Plugin Name:       Accordion
 * Description:       A Simple Accordion Block for Gutenberg Editor.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Anastasios Kesidis
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       accordion
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

function create_block_accordion_block_init() {
	register_block_type( __DIR__ . '/build', array(
		'render_callback' => 'render_accordion_block'
	) );
}

function render_accordion_block( $attributes, $content ) {
    if (isset($attributes['isFAQ']) && $attributes['isFAQ']) {
        add_action('wp_head', function() use ($attributes) {
            $faq_schema = array(
                "@context" => "https://schema.org",
                "@type" => "FAQPage",
                "mainEntity" => array_map(function($item) {
                    return array(
                        "@type" => "Question",
                        "name" => $item['title'],
                        "acceptedAnswer" => array(
                            "@type" => "Answer",
                            "text" => $item['content']
                        )
                    );
                }, $attributes['items'])
            );
            echo '<script type="application/ld+json">' . json_encode($faq_schema) . '</script>';
        });
    }

    return $content;
}

add_action( 'init', 'create_block_accordion_block_init' );
