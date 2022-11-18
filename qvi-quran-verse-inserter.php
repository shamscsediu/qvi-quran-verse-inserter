<?php
/**
 * Plugin Name:       Quran Verse Inserter
 * Description:       Easily insert Quran verse to your post
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Shams Hasan
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       qvi-quran-verse-inserter
 *
 * @package           qvi
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function qvi_qvi_quran_verse_inserter_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'qvi_qvi_quran_verse_inserter_block_init' );
