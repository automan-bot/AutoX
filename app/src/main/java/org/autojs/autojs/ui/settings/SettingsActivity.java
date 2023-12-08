package org.autojs.autojs.ui.settings;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.widget.Toolbar;
import androidx.core.util.Pair;
import androidx.fragment.app.DialogFragment;
import androidx.preference.Preference;
import androidx.preference.PreferenceFragmentCompat;

import com.stardust.pio.PFiles;
import com.stardust.theme.app.ColorSelectActivity;
import com.stardust.theme.util.ListBuilder;
import com.stardust.util.MapBuilder;

import org.androidannotations.annotations.AfterViews;
import org.androidannotations.annotations.EActivity;
import org.autojs.autoxjs.R;
import org.autojs.autojs.ui.BaseActivity;
import org.autojs.autojs.ui.widget.CommonMarkdownView;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import de.psdev.licensesdialog.LicenseResolver;
import de.psdev.licensesdialog.LicensesDialog;
import de.psdev.licensesdialog.licenses.License;

/**
 * Created by Stardust on 2017/2/2.
 * update by aaron 2022年1月16日
 */
@EActivity(R.layout.activity_settings)
public class SettingsActivity extends BaseActivity {

    static {
        LicenseInfo.INSTANCE.install();
    }
    private static final List<Pair<Integer, Integer>> COLOR_ITEMS = new ListBuilder<Pair<Integer, Integer>>()
            .add(new Pair<>(R.color.theme_color_red, R.string.theme_color_red))
            .add(new Pair<>(R.color.theme_color_pink, R.string.theme_color_pink))
            .add(new Pair<>(R.color.theme_color_purple, R.string.theme_color_purple))
            .add(new Pair<>(R.color.theme_color_dark_purple, R.string.theme_color_dark_purple))
            .add(new Pair<>(R.color.theme_color_indigo, R.string.theme_color_indigo))
            .add(new Pair<>(R.color.theme_color_blue, R.string.theme_color_blue))
            .add(new Pair<>(R.color.theme_color_light_blue, R.string.theme_color_light_blue))
            .add(new Pair<>(R.color.theme_color_blue_green, R.string.theme_color_blue_green))
            .add(new Pair<>(R.color.theme_color_cyan, R.string.theme_color_cyan))
            .add(new Pair<>(R.color.theme_color_green, R.string.theme_color_green))
            .add(new Pair<>(R.color.theme_color_light_green, R.string.theme_color_light_green))
            .add(new Pair<>(R.color.theme_color_yellow_green, R.string.theme_color_yellow_green))
            .add(new Pair<>(R.color.theme_color_yellow, R.string.theme_color_yellow))
            .add(new Pair<>(R.color.theme_color_amber, R.string.theme_color_amber))
            .add(new Pair<>(R.color.theme_color_orange, R.string.theme_color_orange))
            .add(new Pair<>(R.color.theme_color_dark_orange, R.string.theme_color_dark_orange))
            .add(new Pair<>(R.color.theme_color_brown, R.string.theme_color_brown))
            .add(new Pair<>(R.color.theme_color_gray, R.string.theme_color_gray))
            .add(new Pair<>(R.color.theme_color_blue_gray, R.string.theme_color_blue_gray))
            .list();

    public static void selectThemeColor(Context context) {
        List<ColorSelectActivity.ColorItem> colorItems = new ArrayList<>(COLOR_ITEMS.size());
        for (Pair<Integer, Integer> item : COLOR_ITEMS) {
            colorItems.add(new ColorSelectActivity.ColorItem(context.getString(item.second),
                    context.getResources().getColor(item.first)));
        }
        ColorSelectActivity.startColorSelect(context, context.getString(R.string.mt_color_picker_title), colorItems);
    }

    @AfterViews
    void setUpUI() {
        setUpToolbar();
        getSupportFragmentManager().beginTransaction().replace(R.id.fragment_setting, new PreferenceFragment()).commit();
    }

    private void setUpToolbar() {
        Toolbar toolbar = $(R.id.toolbar);
        toolbar.setTitle(R.string.text_setting);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        toolbar.setNavigationOnClickListener(v -> finish());
    }


    public static class PreferenceFragment extends PreferenceFragmentCompat {

        private Map<String, Runnable> ACTION_MAP;


        @Override
        public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);

        }

        @Override
        public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
            addPreferencesFromResource(R.xml.preferences);
        }

        @Override
        public void onDisplayPreferenceDialog(Preference preference) {

            DialogFragment dialogFragment = null;
            if (preference instanceof ScriptDirPathPreference) {
                dialogFragment = ScriptDirPathPreferenceFragmentCompat.newInstance(preference.getKey());
            }
            if (dialogFragment != null) {
                dialogFragment.setTargetFragment(this, 1234);
                dialogFragment.show(this.getParentFragmentManager(), "androidx.preference.PreferenceFragment.DIALOG1");
            } else {
                super.onDisplayPreferenceDialog(preference);
            }

        }

        @Override
        public void onStart() {
            super.onStart();
            ACTION_MAP = new MapBuilder<String, Runnable>()
//                    .put(getString(R.string.text_theme_color), () -> selectThemeColor(getActivity()))
//                    .put(getString(R.string.text_check_for_updates), () -> new UpdateCheckDialog(getActivity()).show())
//                    .put(getString(R.string.text_issue_report), () -> startActivity(new Intent(getActivity(), IssueReporterActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)))
                    .put(getString(R.string.text_about_me_and_repo), () -> startActivity(new Intent(getActivity(), AboutActivity_.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)))
                    .put(getString(R.string.text_licenses), () -> showLicenseDialog())
                    .put(getString(R.string.text_licenses_other), () -> showLicenseDialog2())
                    .build();
        }


        @Override
        public boolean onPreferenceTreeClick(Preference preference) {
            Runnable action = ACTION_MAP.get(preference.getTitle().toString());
            if (action != null) {
                action.run();
                return true;
            } else {
                return super.onPreferenceTreeClick(preference);
            }
        }

        private void showLicenseDialog() {
            new LicensesDialog.Builder(getActivity())
                    .setNotices(R.raw.licenses)
                    .setIncludeOwnLicense(true)
                    .build()
                    .show();
        }

        private void showLicenseDialog2() {
            new CommonMarkdownView.DialogBuilder(getActivity())
                    .padding(36, 0, 36, 0)
                    .markdown(PFiles.read(getResources().openRawResource(R.raw.licenses_other)))
                    .title(R.string.text_licenses_other)
                    .positiveText(R.string.ok)
                    .canceledOnTouchOutside(false)
                    .show();
        }

    }
}
