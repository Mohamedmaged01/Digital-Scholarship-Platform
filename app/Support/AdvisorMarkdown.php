<?php

namespace App\Support;

/**
 * Renders the small Markdown subset the AI advisor writes in: paragraphs,
 * bullet lists, bold, italic and inline code. Everything else is escaped, so an
 * answer can never inject markup into the page.
 */
class AdvisorMarkdown
{
    public static function toHtml(string $markdown): string
    {
        $lines = preg_split('/\r?\n/', $markdown) ?: [];
        $html = [];
        $inList = false;

        foreach ($lines as $line) {
            $trimmed = trim($line);

            if ($trimmed === '') {
                if ($inList) {
                    $html[] = '</ul>';
                    $inList = false;
                }

                continue;
            }

            $isBullet = str_starts_with($trimmed, '- ');
            $content = self::inline($isBullet ? substr($trimmed, 2) : $trimmed);

            if ($isBullet) {
                if (! $inList) {
                    $html[] = '<ul class="list-disc space-y-1 ps-5">';
                    $inList = true;
                }

                $html[] = '<li>'.$content.'</li>';

                continue;
            }

            if ($inList) {
                $html[] = '</ul>';
                $inList = false;
            }

            $html[] = '<p>'.$content.'</p>';
        }

        if ($inList) {
            $html[] = '</ul>';
        }

        return implode('', $html);
    }

    protected static function inline(string $text): string
    {
        $escaped = e($text);

        $escaped = preg_replace('/\*\*(.+?)\*\*/u', '<strong>$1</strong>', $escaped) ?? $escaped;
        $escaped = preg_replace('/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/u', '<em>$1</em>', $escaped) ?? $escaped;

        return preg_replace(
            '/`(.+?)`/u',
            '<code class="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em]">$1</code>',
            $escaped,
        ) ?? $escaped;
    }
}
