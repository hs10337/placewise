import SwiftUI

struct PlaceResolutionSheet: View {
    let model: ResolvedPlaceSheetModel

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(model.brief?.name ?? model.resolution.place?.name ?? "Area context")
                .font(.title2.weight(.semibold))

            if let hook = model.brief?.hook, !hook.isEmpty {
                Text(hook)
                    .font(.headline)
            }

            Text(summaryText)
                .font(.body)
                .foregroundStyle(.secondary)

            HStack(spacing: 12) {
                Label(
                    model.resolution.mode.replacingOccurrences(of: "_", with: " "),
                    systemImage: "mappin.and.ellipse"
                )
                Label(model.resolution.confidence.capitalized, systemImage: "checkmark.shield")
            }
            .font(.subheadline)
            .foregroundStyle(.secondary)

            if let whyItMatters = model.brief?.whyItMatters, !whyItMatters.isEmpty {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Why it matters")
                        .font(.headline)
                    Text(whyItMatters)
                        .font(.callout)
                        .foregroundStyle(.secondary)
                }
            }

            if let facts = model.brief?.facts, !facts.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Notable facts")
                        .font(.headline)
                    ForEach(facts, id: \.self) { fact in
                        Text("• \(fact)")
                            .font(.callout)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            if let distanceMeters = model.resolution.distanceMeters {
                Text("Nearest match is \(Int(distanceMeters.rounded())) meters away.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            if let place = model.resolution.place {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Coordinates")
                        .font(.headline)
                    Text(
                        "\(place.latitude.formatted(.number.precision(.fractionLength(4)))), " +
                            "\(place.longitude.formatted(.number.precision(.fractionLength(4))))"
                    )
                    .font(.callout.monospacedDigit())
                    .foregroundStyle(.secondary)
                }
            }

            if let sources = model.brief?.sources, !sources.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Sources")
                        .font(.headline)
                    ForEach(Array(sources.enumerated()), id: \.offset) { _, source in
                        VStack(alignment: .leading, spacing: 2) {
                            Text(source.title)
                                .font(.callout.weight(.medium))
                            Text(source.labelType.capitalized)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }

            Spacer()
        }
        .padding(20)
        .presentationDetents([.height(320), .medium, .large])
        .presentationDragIndicator(.visible)
    }

    private var summaryText: String {
        if let summary = model.brief?.summary, !summary.isEmpty {
            return summary
        }

        if let place = model.resolution.place {
            let modeDescription = model.resolution.mode.replacingOccurrences(of: "_", with: " ")
            return "\(place.name) currently resolves as a \(modeDescription) result in San Francisco."
        }

        return "No strong place match was found for this point yet, so the app is falling back to broader area context."
    }
}
