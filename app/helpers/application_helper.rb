module ApplicationHelper
  MANIFEST_PATH = 'public/packs/manifest.json'.freeze

  def asset_bundle_path(entry, **options)
    @manifest ||= JSON.parse(File.read(MANIFEST_PATH))
    asset_path(@manifest.fetch(entry), **options)
  end
end
