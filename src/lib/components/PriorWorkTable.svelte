<!--
	Table 1 of the paper as an HTML table (it was a screenshot). On phones each row becomes a
	small card with the column names as labels.
-->
<script lang="ts">
	import { results } from '#lib/content/results.js';

	const table = results.priorWork.table;
</script>

<figure class="figure">
	<div class="scroller">
		<table>
			<thead>
				<tr>
					{#each table.columns as column (column)}
						<th scope="col">{column}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each table.rows as [name, ...cells], r (r)}
					<tr class:ours={r === table.ours}>
						<th scope="row">{@html name}</th>
						{#each cells as cell, c (c)}
							<!-- The span keeps inline markup together in the phone layout's grid. -->
							<td data-label={table.columns[c + 1]} class:num={table.numeric.includes(c + 1)}>
								<span>{@html cell}</span>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<!-- prettier-ignore -->
	<figcaption><b>{table.label}</b> <b><i>{table.captionTitle}</i></b> {@html table.caption}</figcaption>
</figure>

<style>
	/* Mid-size screens: scroll the table sideways inside its box rather than the page. */
	.scroller {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		border-top: 2px solid var(--ink);
		border-bottom: 2px solid var(--ink);
		font-family: var(--serif);
		font-size: 1.0625rem;
		line-height: 1.4;
		font-variant-numeric: lining-nums tabular-nums;
	}

	th,
	td {
		padding: 0.7rem 0.9rem;
		text-align: left;
		vertical-align: top;
	}

	th:first-child,
	td:first-child {
		padding-left: 0;
	}

	th:last-child,
	td:last-child {
		padding-right: 0;
		text-align: right;
	}

	thead th {
		border-bottom: 1px solid var(--ink);
		font-family: var(--sans);
		font-size: 0.875rem;
		font-weight: 600;
		white-space: nowrap;
	}

	tbody th {
		font-weight: 400;
		white-space: nowrap;
	}

	tbody tr + tr > * {
		border-top: 1px solid var(--line);
	}

	.num {
		white-space: nowrap;
	}

	.ours > * {
		background: var(--accent-soft);
	}

	.ours > :first-child {
		box-shadow: -0.75rem 0 0 var(--accent-soft);
	}

	.ours > :last-child {
		box-shadow: 0.75rem 0 0 var(--accent-soft);
	}

	figcaption {
		max-width: var(--measure);
		margin-top: 0.9rem;
		color: var(--ink-2);
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	figcaption b {
		color: var(--ink);
		font-weight: 600;
	}

	/* Phones: one card per row, column names as labels. */
	@media (max-width: 40rem) {
		table,
		tbody,
		tr,
		th,
		td {
			display: block;
		}

		table {
			border: 0;
		}

		thead {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}

		tbody tr {
			padding: 0.9rem 1rem;
			border-top: 1px solid var(--line);
		}

		tbody tr:last-child {
			border-bottom: 1px solid var(--line);
		}

		tbody tr + tr > * {
			border-top: 0;
		}

		th,
		td,
		th:first-child,
		td:first-child,
		th:last-child,
		td:last-child {
			padding: 0.1rem 0;
			text-align: left;
		}

		tbody th {
			margin-bottom: 0.35rem;
			font-size: 1.1875rem;
			white-space: normal;
		}

		td {
			display: grid;
			grid-template-columns: 7.5rem minmax(0, 1fr);
			gap: 0.75rem;
		}

		td::before {
			content: attr(data-label);
			color: var(--ink-3);
			font-family: var(--sans);
			font-size: 0.8125rem;
			line-height: 1.8;
		}

		.num {
			white-space: normal;
		}

		.ours > *,
		.ours > :first-child,
		.ours > :last-child {
			background: none;
			box-shadow: none;
		}

		.ours {
			border-radius: 8px;
			background: var(--accent-soft);
		}
	}
</style>
