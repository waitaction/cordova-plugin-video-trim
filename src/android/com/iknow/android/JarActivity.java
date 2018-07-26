package com.iknow.android;

import android.app.Activity;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.widget.ImageView;

public class JarActivity extends Activity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(MResource.getIdByName(this, "layout", "jar_layout"));
        ImageView mPlayerLogo = (ImageView) this.findViewById(MResource.getIdByName(this,
                "id", "logo"));
        mPlayerLogo.setImageResource(MResource.getIdByName(this, "drawable", "ic_launcher"));
    }
}
